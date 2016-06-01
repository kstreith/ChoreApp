var chore = chore || {};

(function () {
  chore.ThisWeekViewModel = function (config) {
    var self = this;
    self.thisWeekChores = [];
    self.users = config.users || [];
    self.selectedUserId = 1;
    self.fetch();
  }
  chore.ThisWeekViewModel.prototype = Object.create(Object.prototype);
  chore.ThisWeekViewModel.constructor = chore.ThisWeekViewModel;
  chore.ThisWeekViewModel.prototype.setUsers = function (users) {
    var self = this;
    self.users = users;
    chore.executeTemplate($("#thisWeekUserSelection"), self);
  }
  chore.ThisWeekViewModel.prototype.renderLoading = function (isLoading) {
    var self = this;
    if (isLoading) {
      $("#thisWeekTable").hide();
      $("#thisWeekTableSpinner").show();
    } else {
      $("#thisWeekTable").show();
      $("#thisWeekTableSpinner").hide();
    }
  }
  chore.ThisWeekViewModel.prototype.render = function () {
    var self = this;
    chore.executeTemplate($("#thisWeekTable"), self);
  }
  chore.ThisWeekViewModel.prototype.fetch = function () {
    var self = this;
    self.renderLoading(true);
    return chore.ajax({ url: '/api/thisWeek/' + window.encodeURIComponent(self.selectedUserId) }).done(function (data) {
      self.thisWeekChores = data;
      self.thisWeekChores.map(function (item, idx) {
        item.toggle = function (clickedChore) {
          self.toggle(clickedChore);
        }
      });
      self.renderLoading(false);
      self.render();
    });
  }
  chore.ThisWeekViewModel.prototype.toggle = function (clickedChore) {
    var self = this;
    var obj = { ChoreId: clickedChore.ChoreId, ChildId: clickedChore.ChildId, Day: clickedChore.Day };
    var url = '';
    if (clickedChore.Completed) {
      url = '/api/chores/clear';
    } else {
      url = '/api/chores/complete';
    }
    chore.ajax({ url: url, type: 'POST', data: obj }).done(function () {
      self.fetch();
    });
  }
  
}());