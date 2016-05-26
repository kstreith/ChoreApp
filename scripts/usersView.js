var chore = chore || {};
(function () {
  chore.UserViewModel = function (config) {
    var self = this;
    chore.TwoWayBindingModel.call(self);
    self.addProperty('users', []);
    self.addProperty('showSpinner', true);
    self.addProperty('showGrid', false);
    self.addProperty('showDeleteModal', false);
    self.addProperty('showAddEditModal', false);
    self.addProperty('addEditUserNameValue', "");
    self.addEditMode = 'add';
    self.editRecordId = null;
    self.bindToDom($(config.selector));
    self.usersUpdatedCallback = config.usersUpdatedCallback;
    self.fetch();
  }
  chore.UserViewModel.prototype = Object.create(chore.TwoWayBindingModel.prototype);
  chore.UserViewModel.prototype.constructor = chore.UserViewModel;
  chore.UserViewModel.prototype.isInitialized = function () {
    var self = this;
    return self.initDfd;
  }
  chore.UserViewModel.prototype.fetch = function () {
    var self = this;
    self.showSpinner = true;
    self.showGrid = false;
    return  $.ajax({ url: '/api/users' }).done(function (data) {
      data.forEach(function (item) {
        item.deleteUserClick = function () {
          self.deleteUserClick(item);
        }
        item.editUserClick = function () {
          self.editUserClick(item);
        }
      });
      self.users = data;
      self.showSpinner = false;
      self.showGrid = true;
      if (self.usersUpdatedCallback) {
        self.usersUpdatedCallback(self.users);
      }
    });
  }
  chore.UserViewModel.prototype.addUserClick = function () {
    var self = this;
    self.addEditMode = 'add';
    self.addEditUserNameValue = "";
    self.showAddEditModal = true;
  }
  chore.UserViewModel.prototype.editUserClick = function (rowData) {
    var self = this;
    self.addEditMode = 'edit';
    self.addEditUserNameValue = rowData.Name;
    self.editRecordId = rowData.Id;
    self.showAddEditModal = true;
  }
  chore.UserViewModel.prototype.addEditModalOkClick = function () {
    var self = this;
    if (self.addEditMode === 'add') {
      var name = self.addEditUserNameValue;
      var obj = { Id: -1, Name: name };
      $.ajax({ url: '/api/users', type: 'POST', data: JSON.stringify(obj), contentType: 'application/json' }).done(function () {
        self.fetch();
      });
    } else if (self.addEditMode === 'edit') {
      var name = self.addEditUserNameValue;
      var id = self.editRecordId;
      var obj = { Id: id, Name: name };
      $.ajax({ url: '/api/users/' + window.encodeURIComponent(id), type: 'PUT', data: JSON.stringify(obj), contentType: 'application/json' }).done(function () {
        self.fetch();
      });
    }
    self.showAddEditModal = false;
  }
  chore.UserViewModel.prototype.addEditModalCancelClick = function () {
    var self = this;
    self.showAddEditModal = false;
  }
  chore.UserViewModel.prototype.deleteUserClick = function (rowData) {
    var self = this;
    self.deleteRow = rowData;
    self.showDeleteModal = true;
  }
  chore.UserViewModel.prototype.deleteModalOkClick = function () {
    var self = this;
    $.ajax({ url: '/api/users/' + window.encodeURIComponent(self.deleteRow.Id), type: 'DELETE' }).done(function () {
      self.fetch();
    });
    self.showDeleteModal = false;
  }
  chore.UserViewModel.prototype.deleteModalCancelClick = function () {
    var self = this;
    self.showDeleteModal = false;
  }
}());