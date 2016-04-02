var chore = chore || {};
(function () {  
  //-------------- USERS GRID ------------------
  chore.users = [];
  chore.fetchUsers = function () {
    var userUrl = '/api/users';
    //var userUrl = '/api/hackedUsers'; //Uncomment for EX-3.1, EX-3.2, EX-4, EX-5
    return $.ajax({url: userUrl}).done(function (data) {
      chore.users = data;
    });
  }
  
  
  //EX-0: No rendering at all
  chore.renderUsers = function () {
    alert('Render User Table, Data is: \n' + JSON.stringify(chore.users, null, 2));    
  }
  
  
  /*
  //EX-1: Append each row as we go using jquery
  chore.renderUsers = function () {
    var $table = $("#userTable");
    $table.empty();
    $table.append("<thead><tr><th>Name EX-1</th></tr></thead>");
    var $tbody = $("<tbody>").appendTo($table);
    for (var i = 0; i < chore.users.length; ++i) {
      $tbody.append("<tr><td>" + chore.users[i].Name + "</td></tr>");
    }
  }
  */
  
  /*
  //EX-2: Wait until the end to add rows to document
  chore.renderUsers = function () {
    var $table = $("#userTable");
    $table.empty();
    var $thead = $("<thead>");
    $thead.append("<tr><th>Name <i>EX-2</i></th></tr>");
    var $tbody = $("<tbody>");
    for (var i = 0; i < chore.users.length; ++i) {
      var $tr = $("<tr>").appendTo($tbody);
      $("<td>").appendTo($tr).html(chore.users[i].Name);
    }
    $table.append($thead);
    $table.append($tbody);
  }
  */
  
  /*
  //EX-3.1: Fix cross-site scripting attack in EX-2
  chore.renderUsers = function () {
    var $table = $("#userTable");
    $table.empty();
    var $thead = $("<thead>");
    $thead.append("<tr><th>Name <i>EX-3.1</i></th></tr>");
    var $tbody = $("<tbody>");
    for (var i = 0; i < chore.users.length; ++i) {
      var $tr = $("<tr>").appendTo($tbody);
      $("<td>").appendTo($tr).text(chore.users[i].Name);
    }
    $table.append($thead);
    $table.append($tbody);
  }
  */
    
  //EX-3.2: Fix cross-site scripting attack in EX-1
  /*
  chore.renderUsers = function () {
    var $table = $("#userTable");
    $table.empty();
    $table.append("<thead><tr><th>Name <i>EX-3.2</i></th></tr></thead>");
    var $tbody = $("<tbody>").appendTo($table);
    for (var i = 0; i < chore.users.length; ++i) {
      $tbody.append("<tr><td>" + chore.escapeHTML(chore.users[i].Name) + "</td></tr>");
    }
  }
  */
  
  /*
  //EX-4: Same as EX-3.1, but using browser DOM, e.g. no dependency on JQuery 
  chore.renderUsers = function () {
    var table = document.getElementById("userTable");
    for (var i = 0; i < table.children.length; ++i) {
      table.removeNode(table.children[i]);
    }
    var th = document.createElement("th");
    var text = document.createTextNode("Name EX-4");
    th.appendChild(text);
    var tr = document.createElement("tr");
    tr.appendChild(th);    
    var thead = document.createElement("thead");
    thead.appendChild(tr);
    var tbody = document.createElement("tbody");
    for (var i = 0; i < chore.users.length; ++i) {
      tr = document.createElement("tr");
      tbody.appendChild(tr);
      var td = document.createElement("td");
      tr.appendChild(td);
      td.appendChild(document.createTextNode(chore.users[i].Name));
    }
    table.appendChild(thead);
    table.appendChild(tbody);
  }
  */ 
  
  //EX-5: A simple templating language example, must also uncomment EX-5 in HTML file for this to work
  /*
  chore.renderUsers = function () {
    chore.executeTemplate($("#userTable"), chore);
  }
  */
   
  //-------------- CHORES GRID ------------------
  chore.chores = [];
  chore.fetchChores = function () {
    return $.ajax({url: '/api/chores'}).done(function (data) {
      chore.chores = data;
    });
  }
  chore.renderChores = function () {
  }

  //-------------- OUTSTANDING CHORES GRID ------------------
  chore.outstandingChores = [];
  chore.fetchOutstandingChores = function () {
    return $.ajax({url: '/api/outstandingChores'}).done(function (data) {
      chore.outstandingChores = data;
    });
  }
  chore.renderOutstandingChores = function () {
  }

  chore.startApp = function () {
    chore.fetchUsers().always(chore.renderUsers);
    chore.fetchChores().always(chore.renderChores);
    chore.fetchOutstandingChores().always(chore.renderOutstandingChores);
  }  
  chore.startApp();
}());