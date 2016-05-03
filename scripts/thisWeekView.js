var chore = chore || {};
(function () {
  chore.thisWeekChores = [];
  chore.fetchThisWeekChores = function () {
    chore.renderThisWeekChoresLoading(true);
    return $.ajax({ url: '/api/thisWeek/1' }).done(function (data) {
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
}());