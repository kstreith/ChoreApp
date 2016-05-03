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
    $("<div class='tri-modal-overlay'></div>").appendTo($elem.parent());
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
  
}());