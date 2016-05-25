var chore = chore || {};
(function () {       
  chore.startApp = function () {
    //chore.initUsers();
    //chore.fetchUsers();
    chore.userViewModel = new chore.UserViewModel();
    chore.userViewModel.bindToDom($("#userPanel"));
    chore.userViewModel.fetch();
    chore.initChores();
    chore.fetchChores();
    chore.initThisWeekChores();
    chore.fetchThisWeekChores();
  }  
  chore.ajaxDelay = 2000;
  chore.mockAjax = false; // WEBAPI-NOTWORKING - set to true to use mock ajax implementation
  chore.startApp();  
}());