(function () {
  var jqAjax = $.ajax;
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
    if (options.url === '/api/users' && options.type === 'GET') {
      setData(dfd, [{Name: 'John'}, {Name: 'Mary'}]);
    } else {
      setNotFound(dfd);
    }
    return dfd.promise();
  }
}());