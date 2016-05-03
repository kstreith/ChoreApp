var chore = chore || {};
(function () {       
  chore.startApp = function () {
    chore.fetchUsers();
    chore.fetchChores();
    chore.fetchThisWeekChores();
  }  
  chore.ajaxDelay = 2000;
  chore.mockAjax = false; // WEBAPI-NOTWORKING - set to true to use mock ajax implementation
  chore.startApp();  
}());