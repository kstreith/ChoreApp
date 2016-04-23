(function () {
  var fakeData = {
    'GET|/api/users': [
      {Name: 'John', Id: 1},
      {Name: 'Mary', Id: 2}],
    'GET|/api/hackedUsers': [
      {Name: 'John', Id: 1},
      {Name: '<b>Mary</b><script>alert("arbitrary js being executed in your page")</script>', Id: 2}],
    'GET|/api/chores': [
      {Id: 1, ChildName: 'John', ChildId: 1, Description: 'Do Dishes', AssignedDaysFormatted: 'M W F Sa'},
      {Id: 2, ChildName: 'John', ChildId: 1, Description: 'Take Out Trash', AssignedDaysFormatted: 'W'},
      {Id: 5, ChildName: 'John', ChildId: 1, Description: 'Clean Room', AssignedDaysFormatted: 'Su'},
      {Id: 3, ChildName: 'Mary', ChildId: 2, Description: 'Do Dishes', AssignedDaysFormatted: 'T Th Su'},
      {Id: 4, ChildName: 'Mary', ChildId: 2, Description: 'Clean Room', AssignedDaysFormatted: 'Sa'}],
    'GET|/api/thisWeek/1': [
      {ChoreId: 1, ChildId: 1, Description: 'Do Dishes', DayFormatted: 'Monday', Completed: true, Overdue: false},
      {ChoreId: 2, ChildId: 1, Description: 'Take Out Trash', DayFormatted: 'Monday', Completed: false, Overdue: true},
      {ChoreId: 1, ChildId: 1, Description: 'Do Dishes', DayFormatted: 'Wednesday', Completed: false, Overdue: false},
      {ChoreId: 1, ChildId: 1, Description: 'Do Dishes', DayFormatted: 'Friday', Completed: false, Overdue: false},
      {ChoreId: 1, ChildId: 1, Description: 'Do Dishes', DayFormatted: 'Saturday', Completed: false, Overdue: false},
      {ChoreId: 5, ChildId: 1, Description: 'Clean Room', DayFormatted: 'Sunday', Completed: true, Overdue: false}]
  }
  
  function setData(dfd, data) {
    setTimeout(function () {
      dfd.resolve(data, "success", {readyState: 4, responseText: JSON.stringify(data), responseJSON: data, status: 200, statusText: "OK"});
    }, chore.ajaxDelay);
  }
  function setNotFound(dfd) {
    setTimeout(function () {
      dfd.reject({readyState: 4, responseText: "Mock data not found!", status: 404, statusText: "Not found"}, "error", "Not Found");      
    }, 100);
  }
  var originalAjax = $.ajax;
  $.ajax = function (url, settings) {
    if (chore && chore.mockAjax == false) {
      return originalAjax.apply($, arguments);
    }
    var options = {};
    var defaults = { type: 'GET' };
    if ($.isPlainObject(url)) {
      $.extend(options, defaults, url);
    } else {
      $.extend(options, defaults, settings, { url: url });
    }
    var dfd = $.Deferred();
    var dataKey = options.type + '|' + options.url;
    if (fakeData[dataKey]) {
      setData(dfd, fakeData[dataKey]);
    } else {
      setNotFound(dfd);
    }
    return dfd.promise();
  }
    
}());