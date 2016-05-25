var chore = chore || {};
(function () {
  chore.escapeHTML = function (string) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  }
  chore.escapeHTMLJQuery = function (string) {
    return $("<div>").text(string).html();
  }
  chore.showModal = function ($elem) {
    $("<div class='tri-modal-overlay'></div>").appendTo("body");
    $elem.addClass("tri-modal-open");
  }
  chore.hideModal = function ($elem) {
    $(".tri-modal-overlay").remove();
    $elem.removeClass("tri-modal-open");
  }

  chore.showModalWindow = function (config) {
    $("<div class='tri-modal-overlay'></div>").appendTo("body");
    config.$element.addClass("tri-modal-open");
    var hide = function () {
      $(".tri-modal-overlay").remove();
      config.$element.removeClass("tri-modal-open");
    }
    config.$element.off("click.triModalOk").on("click.triModalOk", ".okButton", function (e) {
      var okCallback = config.okCallback || function () { };
      var result = okCallback();
      if (!result) {
        hide();
      }
    });
    config.$element.off("click.triModalCancel").on("click.triModalCancel", ".cancelButton", function (e) {
      var cancelCallback = config.cancelCallback || function () { };
      var result = cancelCallback();
      if (!result) {
        hide();
      }
    });
  }
  
  var renderLoop = function ($loopContainer, parentViewModel) {
    var $template = $loopContainer.data("triLoopTemplate");
    if (!$template) {
      $template = $loopContainer.children().detach();
      $loopContainer.data("triLoopTemplate", $template);
    }
    var propName = $loopContainer.attr("tri-repeat");
    var dataArray = parentViewModel[propName];    
    $loopContainer.empty();
    if (!dataArray || !dataArray.length) {
      return;
    }
    var rowElements = [];    
    for (var i = 0; i < dataArray.length; ++i) {
      var currentRowViewModel = dataArray[i];
      var $renderedTemplate = $template.clone();
      chore.executeTemplate($renderedTemplate, currentRowViewModel);
      rowElements.push($renderedTemplate);      
    }
    $loopContainer.append(rowElements);    
  }
  
  chore.executeTemplate = function ($element, viewModel) {
    $element.walk(function ($curElement) {
      if ($curElement.attr("tri-repeat")) {  
        var propName = $curElement.attr("tri-text");
        var data = viewModel[propName];
        renderLoop($curElement, viewModel)
        return false;
      }
      if ($curElement.attr("tri-text")) {
        var propName = $curElement.attr("tri-text");
        if (viewModel[propName]) {
          $curElement.text(viewModel[propName]);
        }
      }
      if ($curElement.attr("tri-show")) {
        var propName = $curElement.attr("tri-show");
        if (viewModel[propName] === true) {
          $curElement.show();
        }
        else {
          $curElement.hide();
        }        
      }
      if ($curElement.attr("tri-class")) {
        var strConfig = $curElement.attr("tri-class");
        var config = JSON.parse(strConfig);
        if (viewModel[config.prop] === true) {
          $curElement.addClass(config.className);
        }
        else {
          $curElement.removeClass(config.className);
        }        
      }
      if ($curElement.attr("tri-attr")) {
        var strConfig = $curElement.attr("tri-attr");
        var config = JSON.parse(strConfig);
        var configArray = [];
        if (config.length) {
          configArray = config;
        } else {
          configArray = [config];
        }
        configArray.forEach(function (config) {
          $curElement.attr(config.prop, viewModel[config.data]);
        });
      }
      if ($curElement.attr("tri-click")) {
        var funcName = $curElement.attr("tri-click");
        var func = viewModel[funcName];
        if (func && func.apply) {
          $curElement.off("click.tri").on("click.tri", function () {
            func.call(viewModel, viewModel);
          });
        }
      }
    });
  }
  
  $.fn.walk = function(visit) {
      if(this.length === 0) { return; }
      this.each(function(i) {
          var $this = $(this);
          if (visit.call(this, $this, i) === false) { return false; }
          $this.children().walk(visit);
      });
  }

  chore.TwoWayBindingModel = function (obj) {
    var self = this;
    self._obj = obj || {};
    self.subscribers = {};
    self.subscribersId = 1;
    Object.keys(self._obj).forEach(function (key) {
      Object.defineProperty(self, key, {
        enumerable: true,
        get: self.getValue.bind(self, key),
        set: self.setValue.bind(self, key)
      });
    });
    return self;
  }
  chore.TwoWayBindingModel.prototype.addProperty = function (key, value) {
    var self = this;
    self._obj[key] = value;
    Object.defineProperty(self, key, {
      enumerable: true,
      get: self.getValue.bind(self, key),
      set: self.setValue.bind(self, key)
    });
  }
  chore.TwoWayBindingModel.prototype.getValue = function (key) {
    var self = this;
    return self._obj[key];
  }
  chore.TwoWayBindingModel.prototype.setValue = function (key, value) {
    var self = this;
    var oldValue = self._obj[key];
    var type = typeof (oldValue);
    var isPrimitive = (oldValue === null || (type === 'undefined' || type === 'boolean' || type === 'number' || type === 'string'));
    var isDifferent = true;
    if (isPrimitive) {
      isDifferent = !(oldValue === value);
    }
    self._obj[key] = value;
    if (isDifferent) {
      self.notifySubscribers(key);
    }
  }
  chore.TwoWayBindingModel.prototype.notifySubscribers = function (key) {
    var self = this;
    var subscribers = self.subscribers[key];
    if (!subscribers || !subscribers.length) {
      return;
    }
    for (var i = 0; i < subscribers.length; ++i) {
      try {
        var func = subscribers[i].func;
        func.call(null);
      } catch (e) {
        console.log('exception while notifying subscriber ' + e);
      }
    }
  }
  function dispose(key, id) {
    var self = this;
    var subscribers = self.subscribers[key];
    if (!subscribers || !subscribers.length) {
      return;
    }
    for (var i = 0; i < subscribers.length; ++i) {
      if (subscribers[i].id === id) {
        break;
      }
    }
    if (i < subscribers.length) {
      subscribers.splice(i, 1); //remove from array
    }   
  }
  chore.TwoWayBindingModel.prototype.subscribe = function (key, callback) {
    var self = this;
    var subscribers = self.subscribers[key];
    if (!subscribers || !subscribers.length) {
      subscribers = [];
      self.subscribers[key] = subscribers;
    }
    self.subscribersId++;
    subscribers.push({ func: callback, id: self.subscribersId });
    return {
      dispose: dispose.bind(null, key, self.subscribersId)
    };
  }
  chore.TwoWayBindingModel.prototype._renderLoop = function ($loopContainer, parentViewModel) {
    var self = this;
    var $template = $loopContainer.data("triLoopTemplate");
    if (!$template) {
      $template = $loopContainer.children().detach();
      $loopContainer.data("triLoopTemplate", $template);
    }
    var propName = $loopContainer.attr("tri-repeat");
    var dataArray = parentViewModel[propName];
    $loopContainer.empty();
    if (!dataArray || !dataArray.length) {
      return;
    }
    var rowElements = [];
    for (var i = 0; i < dataArray.length; ++i) {
      var currentRowViewModel = dataArray[i];
      var $renderedTemplate = $template.clone();
      self.renderElement($renderedTemplate, currentRowViewModel);
      rowElements.push($renderedTemplate);
    }
    $loopContainer.append(rowElements);
  }
  chore.TwoWayBindingModel.prototype.renderElement = function ($element, viewModel) {
    var self = this;
    $element.walk(function ($curElement) {
      if ($curElement.attr("tri-repeat")) {
        var propName = $curElement.attr("tri-repeat");
        var data = viewModel[propName];
        self._renderLoop($curElement, viewModel);
        if (viewModel.subscribe) {
          viewModel.subscribe(propName, function () {
            self._renderLoop($curElement, viewModel);
          });
        }
        return false;
      }
      if ($curElement.attr("tri-value")) {
        var propName = $curElement.attr("tri-value");
        if (viewModel.hasOwnProperty(propName)) {
          var data = viewModel[propName];
          $curElement.val(data);
          if (viewModel.subscribe) {
            viewModel.subscribe(propName, function () {
              $curElement.val(viewModel[propName]);
            });
          }
          $curElement.on('blur', function () {
            viewModel[propName] = $curElement.val();
          });
        }
        return false;
      }
      if ($curElement.attr("tri-text")) {
        var propName = $curElement.attr("tri-text");
        if (viewModel[propName]) {
          $curElement.text(viewModel[propName]);
        }
      }
      if ($curElement.attr("tri-show")) {
        var propName = $curElement.attr("tri-show");
        if (viewModel[propName] === true) {
          $curElement.show();
        }
        else {
          $curElement.hide();
        }
        if (viewModel.subscribe) {
          viewModel.subscribe(propName, function () {
            if (viewModel[propName] === true) {
              $curElement.show();
            }
            else {
              $curElement.hide();
            }
          });
        }
      }
      if ($curElement.attr("tri-class")) {
        var strConfig = $curElement.attr("tri-class");
        var config = JSON.parse(strConfig);
        if (viewModel[config.prop] === true) {
          $curElement.addClass(config.className);
        }
        else {
          $curElement.removeClass(config.className);
        }
      }
      if ($curElement.attr("tri-attr")) {
        var strConfig = $curElement.attr("tri-attr");
        var config = JSON.parse(strConfig);
        var configArray = [];
        if (config.length) {
          configArray = config;
        } else {
          configArray = [config];
        }
        configArray.forEach(function (config) {
          $curElement.attr(config.prop, viewModel[config.data]);
        });
      }
      if ($curElement.attr("tri-click")) {
        var funcName = $curElement.attr("tri-click");
        var func = viewModel[funcName];
        if (func && func.apply) {
          $curElement.off("click.tri").on("click.tri", function () {
            func.call(viewModel, viewModel);
          });
        }
      }
      if ($curElement.attr("tri-modal")) {
        var propName = $curElement.attr("tri-modal");
        if (viewModel.subscribe) {
          viewModel.subscribe(propName, function () {
            if (viewModel[propName] === true) {
              chore.showModal($curElement);
            }
            else {
              chore.hideModal($curElement);
            }
          });
        }
      }
    });
  }
  chore.TwoWayBindingModel.prototype.bindToDom = function ($element) {
    var self = this;
    self.renderElement($element, self);
  }
  
}());