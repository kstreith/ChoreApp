(function () {
  var fakeData = {
    'GET|/api/users': [{Name: 'John', Id: 1}, {Name: 'Mary', Id: 2}], //XSS: comment out to test cross-site scripting
    'GET|/api/hackedUsers': [{Name: 'John', Id: 1}, {Name: '<b>Mary</b><script>alert("arbitrary js being executed in your page")</script>', Id: 2}],
    'GET|/api/chores': [{Name: 'Take out trash', Id: 1}, {Name: 'Do dishes', Id: 2}],
    'GET|/api/outstandingChores': [{Name: 'Sweep floor', Id: 1}, {Name: 'Make bed', Id: 2}],
  }
  
  function setData(dfd, data) {
    setTimeout(function () {
      dfd.resolve(data, "success", {readyState: 4, responseText: JSON.stringify(data), responseJSON: data, status: 200, statusText: "OK"});
    }, 100);
  }
  function setNotFound(dfd) {
    setTimeout(function () {
      dfd.reject({readyState: 4, responseText: "Mock data not found!", status: 404, statusText: "Not found"}, "error", "Not Found");      
    }, 100);
  }
  $.ajax = function (url, settings) {
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