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
        $curElement.attr(config.prop, viewModel[config.data]);
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