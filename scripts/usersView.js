var chore = chore || {};
(function () {
  chore.users = [];
  chore.fetchUsers = function () {
    chore.renderUsersLoading(true);
    var userUrl = '/api/users';
    return $.ajax({ url: userUrl }).done(function (data) {
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
  }
  chore.initUsers = function () {
  }

  //EX-4: Delete confirmation
  chore.renderUsers = function () {
    chore.executeTemplate($("#userTable"), chore);
    $(".deleteUser").click(function (e) {      
      chore.deleteUserId = $(e.currentTarget).attr("data-id");
      chore.showModal($("#confirmDeleteUserModal"));
    });
  }
  chore.initUsers = function () {
    $("#confirmUserDeletion").on("click", function () {
      $.ajax({ url: '/api/users/' + window.encodeURIComponent(chore.deleteUserId), type: 'DELETE' }).done(function () {
        chore.fetchUsers();
      });
      chore.hideModal($("#confirmDeleteUserModal"));
    });
    $("#cancelUserDeletion").on("click", function () {
      chore.hideModal($("#confirmDeleteUserModal"));
    });
  }

  // EX-5: Use event bubbling and ability to remove event handlers to use a js closure and remove need for global variables
  /*
  chore.renderUsers = function () {
    chore.executeTemplate($("#userTable"), chore);
  }
  chore.initUsers = function () {
    $("#userTable").on("click", ".deleteUser", function (e) {
      var deleteUserId = $(e.currentTarget).attr("data-id");
      chore.showModal($("#confirmDeleteUserModal"));
      $("#confirmUserDeletion").off("click.myNamespace").on("click.myNamespace", function () {
        $.ajax({ url: '/api/users/' + window.encodeURIComponent(deleteUserId), type: 'DELETE' }).done(function () {
          chore.fetchUsers();
        });
        chore.hideModal($("#confirmDeleteUserModal"));
      });
      $("#cancelUserDeletion").off("click.anyString").on("click.anyString", function () {
        chore.hideModal($("#confirmDeleteUserModal"));
      });
    });
  }
  */

  //EX-6: Use fully encapsulated showModal function that takes ok, cancel callbacks to still attach row-level events but avoid a global variable
  /*
  chore.renderUsers = function () {
    chore.executeTemplate($("#userTable"), chore);
    $(".deleteUser").click(function (e) {
      var deleteId = $(e.currentTarget).attr("data-id");
      chore.showModalWindow({
        $element: $("#confirmDeleteUserModal"),
        okCallback: function () {
          $.ajax({ url: '/api/users/' + window.encodeURIComponent(deleteId), type: 'DELETE' }).done(function () {
            chore.fetchUsers();
          });
        }
      });
    });
  }
  chore.initUsers = function () {
  }
  */

  //EX-7: Add editUser with delegate event handler and addUser, using encapsulated modal window functionality
  /*
  chore.initUsers = function () {
    //Add user
    $("#addUser").on("click", function (e) {
      chore.showModalWindow({
        $element: $("#addEditUserModal"),
        okCallback: function () {
          var name = $("#userName").val();
          var obj = { Id: -1, Name: name };
          $.ajax({ url: '/api/users', type: 'POST', data: JSON.stringify(obj), contentType: 'application/json' }).done(function () {
            chore.fetchUsers();
          });
        }
      });
    });

    //Delegate event handler for edit user
    $("#userTable").on("click", ".editUser", function (e) {
      var editId = $(e.currentTarget).attr("data-id");
      var matchedUsers = chore.users.filter(function (user) {
        return String(user.Id) == editId;
      });
      if (!matchedUsers || !matchedUsers.length) {
        return;
      }
      chore.editUser = matchedUsers[0];
      $("#userName").val(chore.editUser.Name);
      chore.showModalWindow({
        $element: $("#addEditUserModal"),
        okCallback: function () {
          var name = $("#userName").val();
          var id = chore.editUser.Id;
          var obj = { Id: id, Name: name };
          $.ajax({ url: '/api/users/' + window.encodeURIComponent(id), type: 'PUT', data: JSON.stringify(obj), contentType: 'application/json' }).done(function () {
            chore.fetchUsers();
          });
        }
      });
    });
  }
  */
}());