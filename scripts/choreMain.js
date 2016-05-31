var chore = chore || {};
(function () {       
  chore.startApp = function () {
    var userViewModel = new chore.UserViewModel({ selector: "#userPanel", usersUpdatedCallback: usersUpdated });
    var choreViewModel = new chore.ChoreViewModel({ users: [] });
    var thisViewModel = new chore.ThisWeekViewModel({ users: [] });
    function usersUpdated(users) {
      choreViewModel.setUsers(users);
      thisViewModel.setUsers(users);
    }
  }
  $("#panelSelection *[data-tri-panel]").each(function (idx, panelBtn) {
    var $panelBtn = $(panelBtn);
    var actualPanelSelector = $panelBtn.attr("data-tri-panel");
    var $actualPanel = $("#" + actualPanelSelector);
    if ($actualPanel.is(":visible")) {
      $panelBtn.addClass("btn-primary");
    }
  });
  $("#panelSelection *[data-tri-panel]").click(function (evt) {
    var $panelBtn = $(evt.target);
    var actualPanelSelector = $panelBtn.attr("data-tri-panel");
    var $actualPanel = $("#" + actualPanelSelector);
    if ($panelBtn.hasClass("btn-primary")) {
      $panelBtn.removeClass("btn-primary");
      $actualPanel.slideUp();
    } else {
      $panelBtn.addClass("btn-primary");
      $actualPanel.slideDown();
    }
  });
  chore.ajax = function (ajaxSettings) {
    var triDelay = ajaxSettings.triDelay; // || 5;
    var triStatusCode = ajaxSettings.triStatusCode; // || 500;
    ajaxSettings.headers = ajaxSettings.headers || {};
    if (triDelay) {
      ajaxSettings.headers["tri-delay"] = triDelay;
    }
    if (triStatusCode) {
      ajaxSettings.headers["tri-statusCode"] = triStatusCode;
    }    
    var response = $.ajax(ajaxSettings);
    response.fail(function () {
      alert('server failed');
    })
    return response;
  }
  chore.startApp();  
}());