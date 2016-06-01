Session 3
----------

In this session, we will be working on:

1) Separating application into view components that are independent
2) Slow api back-end
3) Api errors from back-end
4) Two-way data binding

Starting application and back-end details
------------------------------------------
The application now has a working back-end api written in WebAPI. You will
need Visual Studio 2013 or Visual Studio 2015 to run the WebAPI back-end.
The previous web application from session 1 was simply copied into the
same directory as the new WebAPI project. The front-end is still simple static
html and javascript, the front-end does NOT utilize or require MVC to work.
The static html and javascript from session 1 is simply served by IIS express
by being in the same directory as the WebAPI project.

The back-end does NOT require a database, it stores the data for the chore
application in-memory as C# List's and Dictionary's. It also writes the data
to the disk as *.json files in the App_Data\ folder. When ever the WebAPI
back-end is restarted it will attempt to find the most recent *.json file in
the App_Data\ folder and parse that as the initial in-memory data. If there
aren't any files in the App_Data\ folder, it will simply initialize with some
hard-coded data.

So, the back-end will behave as though it is a database without actually
requiring one. If you want to reset the data, simply delete all the files in
the App_Data\ folder and then restart the WebAPI project.

There are a couple things the WebAPI will prevent:

1) The API prevents deleting a user that has chores, you must first delete
all associated chores before you can delete a user.
2) You cannot edit the assigned user of an existing chore.
3) The API is aware of the current date-time, depending on the day of the
week that you run the application will change with rows in the bottom grid
are shown in red to indicate that a chore is overdue.

1 - Separating into view components
-----------------------------------
In session 1 and 2, we simply had global variables and global functions
to control the grids and the data for the grids. For this session, I have
create a separate JS class for each grid. In choreMain.js, you can see the
code that creates the view model for each grid.

I have used ES5 syntax to create javascript classes. If you look in
choresView.js, you can see that syntax. You must first create a constructor
function. That function then creates any instance level variables for the
class. In order to member methods to the class, you have to add methods
to the prototype, this is because JS uses prototypical inheritance. Before
you can add methods and in order to ensure inheritance works properly, you
need to set the prototype, I'm doing this using Object.create from ES5. Just
to make sure everything works properly you also want to set the constructor,
which you see as well. You can do additional research online to learn about
prototypical inheritance. If you plan on using lots of classes in JS, I'd
recommend using ES6 syntax, it was approved in July 2015, but there are few
browsers that support it natively. You would then need to use something else
like Babel.js or Typescript and perform a build step that converts ES6 syntax
back into ES5 syntax that is supported by older browsers (IE9 and later).

Previously, we had coupling between the children grid and the chore grid,
because both needed access to the list of users. Now that we have separate
classes (e.g. components) for each grid, they are no longer sharing any data.
This problem had to be fixed during the conversion to components. There are
multiple ways to fix this problem.

I chose the option of having the code that creates the components be in
charge of orchestrating the components. You can see that in choreMain.js, it
registers a callback with chore.UserViewModel and then when that callback is
called, it passes the information to both chore.ChoreViewModel and
chore.ThisWeekViewModel. This allows all 3 view models to be connected but
without needing to know about each other.

There are still two bugs in this application that you could immediately fix:
   1 - When the users are changed, the chore grid should be updated. Put some
   code into choresView.js, in the setUsers method. Here you should maybe 
   update the chores grid, maybe *fetch* it?
   2 - When the users are changed, the assignments grid should be updated.
   Put some code into thisWeekView.js, in the setUsers method. Here you
   should maybe update the this week grid, maybe *fetch* it?

For homework, you could work on the following:
   1 - Add someway for the chore.ChoreViewModel and chore.ThisWeekViewModel
   to communicate when the chores are updated by the user. You could do
   something like what I did for chore.UserViewModel or even better come up
   with your own pattern.
   2 - You could experiment with Typescript, if you have VS 2015 or install
   the latest update to VS 2013. This would let you use the updated ES6 syntax
   to create the JS classes.

2 - Slow api back-end
---------------------
This application suffers from a myriad of issues when the server is very slow
to respond.

First, let me talk about how we can simulate slow server times in this
application. In the WebAPI back-end, I've written a filter that looks
for a value in the HTTP request header, called tri-delay. If that value is
present in the HTTP request header, it will delay the request by the
requested amount of seconds. If you're interested in the filter implementation,
search the source code for MakeSlowFilterAttribute.

Now, previously we called $.ajax which is the ajax function provided by
JQuery. In order to set this new HTTP request header, I've written a function
called chore.ajax and put it into choreUtils.js. If you look at this function,
you'll see if you pass an option called triDelay, it will set the proper HTTP
request header before passing all of your other options along to $.ajax. I've
all code in the app to use chore.ajax instead of $.ajax. So, if you want to
delay any request, find the chore.ajax call and then add triDelay: 5 for
instance to delay the request by 5 seconds. If you want to delay all requests
by a certain amount, update line 4 in choreUtils.js. Change it from
something like:
  var triDelay = ajaxSettings.triDelay;
to:
  var triDelay = ajaxSettings.triDelay || 5;
if the code calling chore.ajax doesn't provide a triDelay option, it will now
default to a value of 5.

Using this new ability to delay responses from the server, find some
chore.ajax calls and provide the triDelay option. Or globally update the
default as shown above in choreUtils.js. Use this to find some bugs in the 
application.

For example, globally update the delay to 5 seconds in choreUtils.js as shown
above. You should now be able to go back to the app. Create a new user. Then
delete the user. While the delete is working, click the edit button. You are
allowed to edit a user in the process of being deleted, because we haven't
prevented it. You'll notice that this fails with a server failure, because the
record being edited no longer exists. You can see this failure in the
developer console or in the network tab. You'll notice the user doesn't see this
error. Let's fix that really quick.

In chore.ajax we can also globally deal with server failures. $.ajax returns a
$.Deferred object. You can register callbacks for either ajax success or ajax
failure. You call the .done method passing a callback function for success and
you can call .fail method passing a callback function for error. So, go ahead
and add this code to chore.ajax after $.ajax.

  response.fail(function () {
    alert('ajax failure');
  });

Now, you can go back and try causing the error again. Create a user, then
delete that user. While being deleted, edit the user. You should now see the
alert display about an ajax failure. This came from the edit, since by the time
it happened, the record was already deleted. This is all because we don't
prevent the user from clicking edit while we are waiting on the server to
respond to our delete request.

Ok, how do we fix that? The easiest possible solution is to prevent the user
from doing anything in the page while we wait on the server. In session 2, we
built a modal dialog capability. I've written a modal dialog called #waitModal
that doesn't have any buttons. We can display this modal before we start the
server request and then after we get a response we can hide the modal. This
will effectively prevent the user from doing anything on the page. You can
show the modal using this code:

  chore.showModal($("#waitModal"));

and hide modal using this code:

  chore.hideModal($("#waitModal"));

So, in the deleteModalOkClick, show the modal dialog before the call to
chore.ajax. Make sure you show the modal after the following line:
  self.showDeleteModal = false;
and before the call to chore.ajax. And then in the callback function for
.done, add code to hide the modal. Now, if you try and create the problem
again, create a user, delete a user and then edit a user, you'll notice you
can't do the last step because you were prevented from doing anything on the
page while waiting on the server response for delete. 

You could go through the app and make similiar fixes around all the calls to
chore.ajax. A couple things to think about, does the modal get hidden if the
ajax fails? If not, how do you fix that? Can you put this code to show and hide
the modal in one place, if so, where? How?

More importantly, do you need to show the modal to accomplish your goal of
preventing the user from making changes on the page while waiting on a
response from the server? For example, when adding a user do you need to
prevent clicking on the page while waiting on that operation?

If you think about deleting, could you simply remove the delete/edit icons for
that row in the grid until you received a response from the server? Maybe you
remove it from the grid entirely even before you get a response back from the
server? How would you handle a failure in the delete response in that case? Put
the record back into the array?

3 - Api errors from back-end
----------------------------
Ok, in the earlier section, I showed a simple method for dealing with ajax
errors, displaying an alert dialog to the user. Let's delve into this issue
further. 

First, similar to code I wrote for causing the server to respond slowly, I've
also written code to fake a server failure. You must simply pass an HTTP header
called tri-statusCode to the back-end. There the WebAPI filter that I wrote,
FakeResponseFilterAttribute, will look for that HTTP header and if present will
immediately stop and return that error code, anything other than HTTP 2XX range
response is considered an error. Common error codes are 500 for internal server
error, 400 for bad request, 401 for unauthorized. As before you can pass an
option to chore.ajax called triStatusCode. That option will then cause the
correct HTTP header value to be set before calling $.ajax. So, try adding
triStatusCode: 500 to both chore.ajax calls in addEditModalOkClick, found in
usersView.js. Now, you'll see adding an editing a user always fails from the
server. You'll see the failure in the developer console and/or the network tab.

If you want to globally cause failures, you can update the chore.ajax function
in choreUtils.js similar to what we did earlier for slowing the server down.
Use the || to set a default status code if one isn't provided to the function.

If you do that, you'll notice when you refresh the page, you know get 3
alerts, because we are making separate ajax calls for each grid. You have to
manually dismiss each alert separately. This might not be the best approach.

Another approach is to display notifications that automatically disappear
after some period of time. I've coded something simple up that does that
if you call:

  chore.showErrorMessage('ajax failure');

This will show that message as a notification in the top right. It will show
for 5 seconds until it disappears. Change chore.ajax to use
chore.showErrorMessage instead of alert and see what you think. One of the
disadvantages of this type of error reporting is you aren't telling the user
what error happened or why. Ideally, your web api would return some useful
error code that indicated a better message should be displayed. Let's change
or global error to only show if the status code is 500. WebAPI will return
a 500 status code by default if you have an unhandled exception in your C#.
Let's fix chore.ajax to only show a generic error notification if the status
code is 500. The callback passed to the done method of $.Deferred is provided
multiple arguments, the first of which is jqXHR which the jquery response
object. That has a property called .status which contains the status code
returned from the server. So, something like this might work:

  request.done(function (jqXHR) {
    var code = jqXHR.status;
  });

Can you add code that only calls chore.showErrorMessage if the status
code is 500?

In general, if your C# server code has detected a problem, it might want to
return a status code manually other than 500 that is also not in the 2XX range.
For example, if you attempt to delete a user that has chores created for them,
the api will return a 409 conflict status code. So, let's update usersView.js
to deal with that. In deleteModalOkClick, add code to deal with an ajax failure
and check the status code. If the .status is 409, let's use
chore.showErrorMessage to display a better error message to the user. Something
like, 'A user that has chores assigned cannot be deleted. Please delete all
chores first.'

Remember to use the .fail method of $.Deferred to register a callback function.
Remember the callback function is provided a first argument which is the jqXHR
and that has a .status property which provides you the error code.

Ok, for a real world application, some other things you might consider. For
certain errors, you may want to log the stack trace of your server-side C#
and generate an error identifier that send back with the 500 status code.
You could then display that error identifier to the users along with the
error message. This would allow the users to call into support with that
number and support or the development team could then look up the stack trace
that generated that error identifier.

Anothing thing to consider, if ajax requests are aborted, which occurs when
calling the .abort() method on the $.Deferred() or when the user transitions
to another page, that is considered an error and the .fail callback is run. So,
you might want to check for that case and not display a message to the user,
the second argument to the callback typically is called, textStatus and would
be "abort" in that case.

Lastly, there is whole bunch of territory in here that relates to both
API design and application scalability, when it comes to how you handle
slow server responses, server errors and atomicity.

Atomicity
---------
For example, one button click shouldn't result in two API calls unless they
are transactionally unrelated, e.g. one could succeed and one could fail and
the system would still be in a completely valid state.

Scalability and Server Errors
-----------------------------
Maybe the UI shouldn't wait for an operation to finish. Maybe the API
shouldn't complete the operation, it should simply return as soon as the
operation is queued. For instance, think Amazon.com on Black Friday. They
can't wait on a db call to decrement a inventory account when 10,000+ people
might be buying the same item at nearly the same second. They simply queue the
purchase, the UI only waits for the queueing which is very fast. The UI assumes
the purchase will go through. Later, when the queue is processed on a
completely different server, it might determine that they ran out of inventory
and then e-mails all of the affected users to let them know the item ran out
of stock and then provides them options to cancel their order or wait for the
item on back-order. By not waiting and assuming a purchase will succeeed
there is also less error handling code required. It still requires generic
500, internal server error handling and possibly abort error handling, but
that is it. Any error that happens while working the queue will be dealt with
by other means.

4 - Two-way data binding
------------------------
In sessions 1 and 2, we are always calling a method to force a re-render
of a grid or display of a modal. That kind of pattern is still being used
in choresView.js and thisWeekView.js. Those classes still make calls to
chore.executeTemplate and chore.showModal or chore.showModalWindow. If you
write a web application using Ember, Angular, Knockout, Aurelia you won't
really see that kind of code. Renders just happen automatically as needed. How
does that work?

I've written a very simple two-way data binding. It's a JS class called
chore.TwoWayBindingModel, it's in twoWayDataBinding.js. If you want to play
with, try the following in the developer console:

  m = new chore.TwoWayBindingModel();
  //now add a property, to the model called .testProp, giving it an initial
  //value of 2
  m.addProperty('testProp', 2);
  //query the property
  m.testProp;
  //update the property
  m.testProp = 3;
  //query the property
  m.testProp;
  //you can subscribe to a property using the .subscribe method
  m.subscribe('testProp', function () { console.log('--testProp is now ' + m.testProp); });
  //update the property and see message
  m.testProp = 5;
  //the subscription is only called if the value changes
  //you can also query properties using the .getPropertyValue method
  m.getPropertyValue('testProp');
  //and update the propery using the .setPropertValue method
  m.setPropertyValue('testProp', 6);
  //in fact, when you use .testProp and .testProp = 10, they are simply
  //calling .getPropertyValue and .setPropertyValue underneath. This
  //uses a feature of ES5 (supported in IE9 and later) that is very
  //similiar to C# properties. They look like properties, but actually
  //call registered getter and setter functions.

You could read all of the source code in twoWayDataBinding.js to see how
this is implemented, but it basically uses a hidden object to get/set the
actual values and then maintains a dictionary to keep a list of subscribers
for each property. The set function then does a comparison between the new
value and existing value. If they are different, it looks for any subscribers
for that property and then calls their registered callbacks. Now, this class
doesn't anything for the DOM. So, how does the automatic re-render occur?

In sessions 1 and 2, we created and then updated chore.executeTemplate. In
this session, I've made some additional modifications. On the viewModel, I
check to see if there is a .subscribe function, e.g. we have a two-way model.
If there is, the .executeTemplate then uses that to register a callback when
that value changes in the model. In the callback, it then does the proper
steps to update the DOM.

And that is how two-way data binding can be made to work. This is similiar
to how Knockout and Ember work. Those frameworks use a bunch of extra tricks,
such as not making DOM changes immediately but batching them up using a
micro-task system. The method I showed is basically a notification system,
when there is a change, send out a notification. This is also similiar to
how WPF and XAML work in .NET, using the INotifyPropertyChanged interface.

Another model is a polling or dirty-checking model. In this case, at some
interval the framework captures the state of your data and then compares to
the previous state of your data. It then figures out precisely which fields
have changed as part of doing this comparison. It then notifies any subscribers
that are interested in those changes. This is what Angular uses. I believe
Aurelia actually provides both methods mentioned above and picks the
appropriate one.

If you look at usersView.js, you'll notice it never calls
chore.executeTemplate. It simply sets the .users array and via the
two-way data binding and the .subscribe call in chore.executeTemplate
it simply knows to re-render the loop template when the property of the
view model changes.

I converted usersView.js over completely to use two-way data binding and
subclass the chore.TwoWayBindingModel class. I want to point that only the
tri- attributes that I needed to get usersView.js working are the ones
I fixed in chore.executeTemplate. If you try and convert the entire app over
to use two-way data binding, you will need to add code to chore.executeTemplate
and probably make other changes as well.
  
Final thoughts
--------------

Things you could work on:

  1 - There is a combo box in the bottom grid to change the assigned chores
  that are shown. This needs to be wired up, you could add a event listener for
  the 'change' event on the <select> tag. That would then need to refresh the
  grid but using a different url, one that included the .Id of the newly
  selected user.
  2 - You could change which grids are shown by default on the page, just use
  style='display: none' for example on the element with id="userPanel". This
  panel will always be hidden then every time you refresh the page. You could
  then update choreNav.js to use HTML5 local storage. You could store the
  state of the panels visibility in HTML5 local storage as the user clicks on
  the buttons and then during application start-up you could read the values
  out of HTML5 local storage and then update the buttons and panels visibility
  as appropriate.
  3 - Do some of the other experiments listed above.