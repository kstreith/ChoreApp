var chore = chore || {};
(function () {
  chore.ChoreViewModel = function (config) {
    var self = this;
    self.chores = [];
    self.users = config.users || [];
    chore.executeTemplate($("#chorePanelHeader"), self);
    self.fetch();
  }
  chore.ChoreViewModel.prototype = Object.create(Object.prototype);
  chore.ChoreViewModel.constructor = chore.ChoreViewModel;
  chore.ChoreViewModel.prototype.setUsers = function (users) {
    var self = this;
    self.users = users;
  }
  chore.ChoreViewModel.prototype.addChoreClick = function () {
    var self = this;
    chore.executeTemplate($("#addEditChoreModal"), self);
    var userId = null;
    if (self.users.length) {
      userId = self.users[0].Id;
    }
    $("#choreChild").val(String(userId));
    chore.showModalWindow({
      $element: $("#addEditChoreModal"),
      okCallback: function () {
        var description = $("#choreDescription").val();
        var onSunday = $("#choreOnSunday").prop("checked");
        var onMonday = $("#choreOnMonday").is(":checked");
        var onTuesday = $("#choreOnTuesday")[0].checked;
        var onWednesday = $("#choreOnWednesday").is(":checked");
        var onThursday = $("#choreOnThursday").is(":checked");
        var onFriday = $("#choreOnFriday").is(":checked");
        var onSaturday = $("#choreOnSaturday").is(":checked");
        var childId = parseInt($("#choreChild").val(), 10);
        var obj = { Id: -1, ChildId: childId, Description: description, OnSunday: onSunday, OnMonday: onMonday, OnTuesday: onTuesday, OnWednesday: onWednesday, OnThursday: onThursday, OnFriday: onFriday, OnSaturday: onSaturday };
        var data = JSON.stringify(obj);
        chore.ajax({ url: '/api/chores', type: 'POST', data: data, contentType: 'application/json' }).done(function () {
          self.fetch();
        });
      }
    });
  }
  chore.ChoreViewModel.prototype.editChoreClick = function (choreClicked) {
    var self = this;
    document.getElementById("choreDescription").value = choreClicked.Description;
    document.getElementById("choreOnSunday").checked = choreClicked.OnSunday;
    $("#choreOnMonday").prop("checked", choreClicked.OnMonday);
    $("#choreOnTuesday").prop("checked", choreClicked.OnTuesday);
    $("#choreOnWednesday").prop("checked", choreClicked.OnWednesday);
    $("#choreOnThursday").prop("checked", choreClicked.OnThursday);
    $("#choreOnFriday").prop("checked", choreClicked.OnFriday);
    $("#choreOnSaturday").prop("checked", choreClicked.OnSaturday);
    chore.executeTemplate($("#addEditChoreModal"), self);
    $("#choreChild").val(String(choreClicked.ChildId));
    chore.showModalWindow({
      $element: $("#addEditChoreModal"),
      okCallback: function () {
        var description = $("#choreDescription").val();
        var onSunday = $("#choreOnSunday").prop("checked");
        var onMonday = $("#choreOnMonday").is(":checked");
        var onTuesday = $("#choreOnTuesday")[0].checked;
        var onWednesday = $("#choreOnWednesday").is(":checked");
        var onThursday = $("#choreOnThursday").is(":checked");
        var onFriday = $("#choreOnFriday").is(":checked");
        var onSaturday = $("#choreOnSaturday").is(":checked");
        var childId = parseInt($("#choreChild").val(), 10);
        var id = choreClicked.Id;
        var obj = { Id: id, ChildId: childId, Description: description, OnSunday: onSunday, OnMonday: onMonday, OnTuesday: onTuesday, OnWednesday: onWednesday, OnThursday: onThursday, OnFriday: onFriday, OnSaturday: onSaturday };
        var data = JSON.stringify(obj);
        chore.ajax({ url: '/api/chores/' + window.encodeURIComponent(id), type: 'PUT', data: data, contentType: 'application/json' }).done(function () {
          self.fetch();
        });
      }
    });
  }
  chore.ChoreViewModel.prototype.deleteChoreClick = function (choreClicked) {
    var self = this;
    chore.showModalWindow({
      $element: $("#confirmDeleteChoreModal"),
      okCallback: function () {
        chore.ajax({ url: '/api/chores/' + window.encodeURIComponent(choreClicked.Id), type: 'DELETE' }).done(function () {
          self.fetch();
        });
      }
    });
  }
  chore.ChoreViewModel.prototype.fetch = function () {
    var self = this;
    self.renderLoading(true);
    return chore.ajax({ url: '/api/chores' }).done(function (data) {
      data.map(function (item) {
        item.editChoreClick = function (choreClicked) {
          self.editChoreClick(choreClicked);
        }
        item.deleteChoreClick = function (choreClicked) {
          self.deleteChoreClick(choreClicked);
        }
      });
      self.chores = data;
      self.renderLoading(false);
      self.render();
    });
  }
  chore.ChoreViewModel.prototype.render = function () {
    var self = this;
    chore.executeTemplate($("#choreTable"), self);
  }
  chore.ChoreViewModel.prototype.renderLoading = function (isLoading) {
    var self = this;
    if (isLoading) {
      $("#choreTable").hide();
      $("#choreTableSpinner").show();
    } else {
      $("#choreTable").show();
      $("#choreTableSpinner").hide();
    }
  }
}());