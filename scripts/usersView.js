var chore = chore || {};
(function () {
  chore.users = [];
  chore.users = [];
  chore.fetchUsers = function () {
    chore.renderUsersLoading(true);
    var userUrl = '/api/users';
    //var userUrl = '/api/hackedUsers'; //Uncomment for EX-3.1, EX-3.2, EX-4, EX-5
    return $.ajax({ url: userUrl }).done(function (data) {
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
}());