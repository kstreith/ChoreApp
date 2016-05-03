var chore = chore || {};
(function () {
  chore.chores = [];
  chore.addChoreClick = function () {
    chore.executeTemplate($("#addEditChoreModal"), chore);
    $("#choreChild").val(String(chore.users[0].Id));
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
        $.ajax({ url: '/api/chores', type: 'POST', data: data, contentType: 'application/json' }).done(function () {
          chore.fetchChores();
        });
      }
    });
  }
  chore.editChoreClick = function (choreClicked) {
    document.getElementById("choreDescription").value = choreClicked.Description;
    document.getElementById("choreOnSunday").checked = choreClicked.OnSunday;
    $("#choreOnMonday").prop("checked", choreClicked.OnMonday);
    $("#choreOnTuesday").prop("checked", choreClicked.OnTuesday);
    $("#choreOnWednesday").prop("checked", choreClicked.OnWednesday);
    $("#choreOnThursday").prop("checked", choreClicked.OnThursday);
    $("#choreOnFriday").prop("checked", choreClicked.OnFriday);
    $("#choreOnSaturday").prop("checked", choreClicked.OnSaturday);
    chore.executeTemplate($("#addEditChoreModal"), chore);
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
        $.ajax({ url: '/api/chores/' + window.encodeURIComponent(id), type: 'PUT', data: data, contentType: 'application/json' }).done(function () {
          chore.fetchChores();
        });
      }
    });
  }
  chore.deleteChoreClick = function (choreClicked) {
    chore.showModalWindow({
      $element: $("#confirmDeleteChoreModal"),
      okCallback: function () {
        $.ajax({ url: '/api/chores/' + window.encodeURIComponent(choreClicked.Id), type: 'DELETE' }).done(function () {
          chore.fetchChores();
        });
      }
    });
  }
  chore.initChores = function () {
    chore.executeTemplate($("#chorePanelHeader"), chore);
  }
  chore.fetchChores = function () {
    chore.renderChoresLoading(true);
    return $.ajax({ url: '/api/chores' }).done(function (data) {
      data.map(function (item) {
        item.editChoreClick = function (choreClicked) {
          chore.editChoreClick(choreClicked);
        }
        item.deleteChoreClick = function (choreClicked) {
          chore.deleteChoreClick(choreClicked);
        }
      });
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
}());