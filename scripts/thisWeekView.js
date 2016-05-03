var chore = chore || {};
(function () {
  chore.thisWeekChores = [];
  chore.initThisWeekChores = function () {
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

  //EX-1: Simple event handling - attach event per row to complete a chore
  chore.fetchThisWeekChores = function () {
    chore.renderThisWeekChoresLoading(true);
    return $.ajax({ url: '/api/thisWeek/1' }).done(function (data) {
      chore.thisWeekChores = data;
      chore.thisWeekChores.map(function (item, idx) {
        item._Id = idx; //need to add _Id attribute so that template can render it
      });
      chore.renderThisWeekChoresLoading(false);
      chore.renderThisWeekChores();
    });
  }
  chore.renderThisWeekChores = function () {
    chore.executeTemplate($("#thisWeekTable"), chore);
    
    $("td[data-completed='false']").on("click", function (e) {
      var idx = parseInt($(e.currentTarget).attr("data-id"), 10);
      var thisChore = chore.thisWeekChores[idx];
      var obj = { ChoreId: thisChore.ChoreId, ChildId: thisChore.ChildId, Day: thisChore.Day };
      $.ajax({ url: '/api/chores/complete', type: 'POST', data: obj }).done(function () {
        chore.fetchThisWeekChores();
      });
    });
    //TODO: Add support for clearing completion
    //Attach click event to "td[data-completed='true']"
    //Use '/api/chores/clear', has same arguments as '/api/chores/complete'
  }

  //EX-2: Use event bubbling and event delegation to only attach a single event handler to <table> tag instead
  /*
  chore.renderThisWeekChores = function () {
    chore.executeTemplate($("#thisWeekTable"), chore);
  }
  chore.initThisWeekChores = function () {
    $("#thisWeekTable").on("click", "td[data-completed='false']", function (e) {
      var idx = parseInt($(e.currentTarget).attr("data-id"), 10);
      var thisChore = chore.thisWeekChores[idx];
      var obj = { ChoreId: thisChore.ChoreId, ChildId: thisChore.ChildId, Day: thisChore.Day };
      $.ajax({ url: '/api/chores/complete', type: 'POST', data: obj }).done(function () {
        chore.fetchThisWeekChores();
      });
    });
    //TODO: Add support for clearing completion
    //Attach click event to "td[data-completed='true']"
    //Use '/api/chores/clear', has same arguments as '/api/chores/complete'
  }
  */

  //EX-3: Use tri-click which uses a js closure to avoid need to populate DOM element with data-Id attribute, still attaches event handler per row
  /*
  chore.initThisWeekChores = function () {
  }
  chore.fetchThisWeekChores = function () {
    chore.renderThisWeekChoresLoading(true);
    return $.ajax({ url: '/api/thisWeek/1' }).done(function (data) {
      chore.thisWeekChores = data;
      chore.thisWeekChores.map(function (item, idx) {
        item.toggle = function (clickedChore) {
          chore.toggle(clickedChore);
        }
      });
      chore.renderThisWeekChoresLoading(false);
      chore.renderThisWeekChores();
    });
  }
  chore.toggle = function (clickedChore) {
    var obj = { ChoreId: clickedChore.ChoreId, ChildId: clickedChore.ChildId, Day: clickedChore.Day };
    var url = '';
    if (clickedChore.Completed) {
      url = '/api/chores/clear';
    } else {
      url = '/api/chores/complete';
    }
    $.ajax({ url: url, type: 'POST', data: obj }).done(function () {
      chore.fetchThisWeekChores();
    });
  }
  */

}());