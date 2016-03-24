var chore = chore || {};
(function () {
  users = [];
  chore.fetchUsers = function fetchUsers() {
    return $.ajax({url: '/api/users'}).done(function (data) {
      users = data;
    });
  }
  chore.renderUsers = function renderUsers() {
    var $table = $("#userTable");
    $table.empty();
    $table.append("<tr><th>Name</th></tr>");
    for (var i = 0; i < users.length; ++i) {
      $table.append("<tr><td>" + users[i].Name + "</td></tr>");
    }
  }
  chore.startApp = function () {
    chore.fetchUsers().done(chore.renderUsers);
  }
  chore.startApp();
}());