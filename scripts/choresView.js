var chore = chore || {};
(function () {
  chore.chores = [];
  chore.initChores = function () {
    document.querySelector("#addChore").addEventListener("click", function (e) {
      chore.choreAddEditType = 'add';
      chore.executeTemplate($("#addEditChoreModal"), chore);
      $("#choreChild").val(String(chore.users[0].Id));
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
      var childId = parseInt($("#choreChild").val(), 10);
      if (chore.choreAddEditType === 'add') {
        var obj = { Id: -1, ChildId: childId, Description: description, OnSunday: onSunday, OnMonday: onMonday, OnTuesday: onTuesday, OnWednesday: onWednesday, OnThursday: onThursday, OnFriday: onFriday, OnSaturday: onSaturday };
        var data = JSON.stringify(obj);
        $.ajax({ url: '/api/chores', type: 'POST', data: data, contentType: 'application/json' }).done(function () {
          chore.fetchChores();
        });
        chore.hideModal($("#addEditChoreModal"));
      } else if (chore.choreAddEditType === 'edit') {
        var id = chore.editChore.Id;
        var obj = { Id: id, ChildId: childId, Description: description, OnSunday: onSunday, OnMonday: onMonday, OnTuesday: onTuesday, OnWednesday: onWednesday, OnThursday: onThursday, OnFriday: onFriday, OnSaturday: onSaturday };
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
  }
  chore.fetchChores = function () {
    chore.renderChoresLoading(true);
    return $.ajax({ url: '/api/chores' }).done(function (data) {
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
      chore.executeTemplate($("#addEditChoreModal"), chore);
      $("#choreChild").val(String(chore.editChore.ChildId));
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
}());