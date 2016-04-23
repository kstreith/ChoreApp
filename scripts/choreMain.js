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

  document.querySelector("#addUser").addEventListener("click", function (e) {
    chore.userAddEditType = 'add';
    chore.showModal($("#addEditUserModal"));
  });
  document.getElementById("addEditUserOk").addEventListener("click", function (e) {
    //var name = $("#userName").val();
    var name = document.getElementById("userName").value;
    if (chore.userAddEditType === 'add') {
      var obj = { Id: -1, Name: name };
      var data = JSON.stringify(obj);
      $.ajax({ url: '/api/users', type: 'POST', data: data, contentType: 'application/json' }).done(function () {
        chore.fetchUsers();
      });
      chore.hideModal($("#addEditUserModal"));
    } else if (chore.userAddEditType === 'edit') {
      var id = chore.editUser.Id;
      var obj = { Id: id, Name: name };
      var data = JSON.stringify(obj);
      $.ajax({ url: '/api/users/' + window.encodeURIComponent(id), type: 'PUT', data: data, contentType: 'application/json' }).done(function () {
        chore.fetchUsers();
      });
      chore.hideModal($("#addEditUserModal"));
    }
  });
  document.getElementById("addEditUserCancel").addEventListener("click", function () {
    chore.hideModal($("#addEditUserModal"));
  });
  
  chore.renderUsersLoading = function (isLoading) {
    if (isLoading) {
      $("#userTable").hide();
      $("#userTableSpinner").show();
    } else {
      $("#userTable").show();
      $("#userTableSpinner").hide();
    }
  } 
  $("#confirmUserDeletion").on("click", function () {
    $.ajax({ url: '/api/users/' + window.encodeURIComponent(chore.deleteUserId), type: 'DELETE' }).done(function () {
      chore.fetchUsers();
    });
    chore.hideModal($("#confirmDeleteUserModal"));
  });
  $("#cancelUserDeletion").on("click", function () {
    chore.hideModal($("#confirmDeleteUserModal"));
  });
  chore.renderUsers = function () {
    chore.executeTemplate($("#userTable"), chore);
    /*
    $(".deleteUser").click(function (e) {      
      var id = e.target.attributes["data-id"].value;
      chore.showModal($("#confirmDeleteUserModal"));
      $("#confirmUserDeletion").on("click", function () {
        $.ajax({ url: '/api/users/' + window.encodeURIComponent(id), type: 'DELETE' }).done(function () {
          chore.fetchUsers();
        });
        hideModal($("#confirmDeleteUserModal"));
      });
      $("#cancelUserDeletion").on("click", function () {
        hideModal($("#confirmDeleteUserModal"));
      });
    });*/
    $(".deleteUser").click(function (e) {
      chore.deleteUserId = e.target.attributes["data-id"].value;
      chore.showModal($("#confirmDeleteUserModal"));
    });
    $(".editUser").click(function (e) {
      var editId = e.target.attributes["data-id"].value;
      var matchedUsers = chore.users.filter(function (user) {
        return String(user.Id) == editId;
      });
      if (!matchedUsers || !matchedUsers.length) {
        return;
      }
      chore.userAddEditType = 'edit';
      chore.editUser = matchedUsers[0];
      document.getElementById("userName").value = chore.editUser.Name;
      chore.showModal($("#addEditUserModal"));
    });
  }
     
  //-------------- CHORES GRID ------------------
  document.querySelector("#addChore").addEventListener("click", function (e) {
    chore.choreAddEditType = 'add';
    chore.showModal($("#addEditChoreModal"));
  });
  $("#confirmChoreDeletion").on("click", function () {
    $.ajax({ url: '/api/chores/' + window.encodeURIComponent(chore.deleteChoreId), type: 'DELETE' }).done(function () {
      chore.fetchChores();
    });
    chore.hideModal($("#confirmDeleteChoreModal"));
  });
  $("#cancelChoreDeletion").on("click", function () {
    chore.hideModal($("#confirmDeleteChoreModal"));
  });

  document.getElementById("addEditChoreOk").addEventListener("click", function (e) {
    var description = $("#choreDescription").val();
    var onSunday = $("#choreOnSunday").prop("checked");
    var onMonday = $("#choreOnMonday").is(":checked");
    var onTuesday = $("#choreOnTuesday")[0].checked;
    var onWednesday = $("#choreOnWednesday").is(":checked");
    var onThursday = $("#choreOnThursday").is(":checked");
    var onFriday = $("#choreOnFriday").is(":checked");
    var onSaturday = $("#choreOnSaturday").is(":checked");
    if (chore.choreAddEditType === 'add') {
      var obj = { Id: -1, ChildId: 1, Description: description, OnSunday: onSunday, OnMonday: onMonday, OnTuesday: onTuesday, OnWednesday: onWednesday, OnThursday: onThursday, OnFriday: onFriday, OnSaturday: onSaturday };
      var data = JSON.stringify(obj);
      $.ajax({ url: '/api/chores', type: 'POST', data: data, contentType: 'application/json' }).done(function () {
        chore.fetchChores();
      });
      chore.hideModal($("#addEditChoreModal"));
    } else if (chore.choreAddEditType === 'edit') {
      var id = chore.editChore.Id;
      var obj = { Id: id, ChildId: 1, Description: description, OnSunday: onSunday, OnMonday: onMonday, OnTuesday: onTuesday, OnWednesday: onWednesday, OnThursday: onThursday, OnFriday: onFriday, OnSaturday: onSaturday };
      var data = JSON.stringify(obj);
      $.ajax({ url: '/api/chores/' + window.encodeURIComponent(id), type: 'PUT', data: data, contentType: 'application/json' }).done(function () {
        chore.fetchChores();
      });
      chore.hideModal($("#addEditChoreModal"));
    }
  });
  document.getElementById("addEditChoreCancel").addEventListener("click", function () {
    chore.hideModal($("#addEditChoreModal"));
  });

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
    $(".deleteChore").click(function (e) {
      chore.deleteChoreId = e.target.attributes["data-id"].value;
      chore.showModal($("#confirmDeleteChoreModal"));
    });
    $(".editChore").click(function (e) {
      var editId = e.target.attributes["data-id"].value;
      var matchedChores = chore.chores.filter(function (user) {
        return String(user.Id) == editId;
      });
      if (!matchedChores || !matchedChores.length) {
        return;
      }
      chore.choreAddEditType = 'edit';
      chore.editChore = matchedChores[0];
      document.getElementById("choreDescription").value = chore.editChore.Description;
      document.getElementById("choreOnSunday").checked = chore.editChore.OnSunday;
      $("#choreOnMonday").prop("checked", chore.editChore.OnMonday);
      $("#choreOnTuesday").prop("checked", chore.editChore.OnTuesday);
      $("#choreOnWednesday").prop("checked", chore.editChore.OnWednesday);
      $("#choreOnThursday").prop("checked", chore.editChore.OnThursday);
      $("#choreOnFriday").prop("checked", chore.editChore.OnFriday);
      $("#choreOnSaturday").prop("checked", chore.editChore.OnSaturday);
      chore.showModal($("#addEditChoreModal"));
    });
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
      chore.thisWeekChores.map(function (item, idx) {
        item._Id = idx;
      });
      chore.renderThisWeekChoresLoading(false);
      chore.renderThisWeekChores();
    });
  }
  chore.renderThisWeekChores = function () {
    chore.executeTemplate($("#thisWeekTable"), chore);
    $(".completedColumn").on("click", function (e) {
      var idx = parseInt(e.currentTarget.attributes["data-id"].value, 10);
      var thisChore = chore.thisWeekChores[idx];
      var obj = { ChoreId: thisChore.ChoreId, ChildId: thisChore.ChildId, Day: thisChore.Day };
      var data = JSON.stringify(obj);
      if (thisChore.Completed) {
        $.ajax({ url: '/api/chores/clear', type: 'POST', data: data, contentType: 'application/json' }).done(function () {
          chore.fetchThisWeekChores();
        });
      } else {
        $.ajax({ url: '/api/chores/complete', type: 'POST', data: data, contentType: 'application/json' }).done(function () {
          chore.fetchThisWeekChores();
        });
      }
    })
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
  chore.mockAjax = false; // WEBAPI-NOTWORKING - set to true to use mock ajax implementation
  chore.startApp();
  
  /*chore.drawSlowFrames = function () {
    chore.renderUsers();
    chore.renderChores();
    chore.renderThisWeekChores();
    window.requestAnimationFrame(chore.drawSlowFrames);        
  }*/
   
  //window.requestAnimationFrame(chore.drawSlowFrames);  
}());