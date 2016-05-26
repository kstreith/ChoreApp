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
  chore.ajaxDelay = 2000;
  chore.mockAjax = false; // WEBAPI-NOTWORKING - set to true to use mock ajax implementation
  chore.startApp();  
}());