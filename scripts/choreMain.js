var chore = chore || {};
(function () {  
  //-------------- USERS GRID ------------------
  chore.users = [];
  chore.fetchUsers = function () {
    chore.renderUsersLoading(true);
    var userUrl = '/api/users';
    //var userUrl = '/api/hackedUsers'; //Uncomment for EX-3.1, EX-3.2, EX-4, EX-5
    return $.ajax({url: userUrl}).done(function (data) {
      chore.users = data;
    chore.renderUsersLoading(false);
      chore.renderUsers();
    });
  }
  
  chore.renderUsersLoading = function (isLoading) {
    if (isLoading) {
      $("#userTable").hide();
      $("#userTableSpinner").show();
    } else {
      $("#userTable").show();
      $("#userTableSpinner").hide();
    }
    $("#userTable").click(function () {
        alert('clicked!');
    });
  }    
  chore.renderUsers = function () {
    chore.executeTemplate($("#userTable"), chore);
  }
     
  //-------------- CHORES GRID ------------------
  chore.chores = [];
  chore.fetchChores = function () {
    chore.renderChoresLoading(true);
    return $.ajax({url: '/api/chores'}).done(function (data) {
      chore.chores = data;
      chore.renderChoresLoading(false);
      chore.renderChores();
    });
  }
  chore.renderChores = function () {
    chore.executeTemplate($("#choreTable"), chore);    
  }
  
  chore.renderChoresLoading = function (isLoading) {
    if (isLoading) {
      $("#choreTable").hide();
      $("#choreTableSpinner").show();
    } else {
      $("#choreTable").show();
      $("#choreTableSpinner").hide();
    }
  }
  
  //-------------- OUTSTANDING CHORES GRID ------------------
  chore.thisWeekChores = [];
  chore.fetchThisWeekChores = function () {
    chore.renderThisWeekChoresLoading(true);
    return $.ajax({url: '/api/thisWeek/1'}).done(function (data) {
      chore.thisWeekChores = data;
      chore.renderThisWeekChoresLoading(false);
      chore.renderThisWeekChores();
    });
  }
  chore.renderThisWeekChores = function () {
    chore.executeTemplate($("#thisWeekTable"), chore);    
  }
  
  chore.renderThisWeekChoresLoading = function (isLoading) {
    if (isLoading) {
      $("#thisWeekTable").hide();
      $("#thisWeekTableSpinner").show();
    } else {
      $("#thisWeekTable").show();
      $("#thisWeekTableSpinner").hide();
    }
  }
  
  chore.startApp = function () {
    chore.fetchUsers();
    chore.fetchChores();
    chore.fetchThisWeekChores();
  }  
  chore.ajaxDelay = 2000;
  chore.startApp();
  
  chore.drawSlowFrames = function () {
    chore.renderUsers();
    chore.renderChores();
    chore.renderThisWeekChores();
    window.requestAnimationFrame(chore.drawSlowFrames);        
  }
   
  window.requestAnimationFrame(chore.drawSlowFrames);  
}());