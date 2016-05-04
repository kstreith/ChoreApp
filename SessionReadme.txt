Session 2
----------

In this session, we will be working with event handlers to add the ability to
complete chores, add/edit/delete users and add/edit/delete chores.

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

Starting Point
---------------

When you start the application, you will be able to do the following:

1) Complete chores in the bottom grid
2) Add/edit/delete chores in the middle grid
3) Delete users in the top grid

As we work on the application, we will add/tweak the following features:

1) Clear out completed chores in the bottom grid
2) Delete users in the top grid
3) Add/edit users in the top grid

There are a couple things the WebAPI will prevent:

1) The API prevents deleting a user that has chores, you must first delete
all associated chores before you can delete a user.
2) You cannot edit the assigned user of an existing chore.
3) The API is aware of the current date-time, depending on the day of the
week that you run the application will change with rows in the bottom grid
are shown in red to indicate that a chore is overdue.

Learning about Events
---------------------

The first task is to learn about browser events and how they work. You can
open EventTest\index.html in your browser. It is a HTML only page, no
javascript and no javascript libraries are included in the page. It includes
some exercies you can do with the page and the developer console to slearn
about how browser events work.

Working with Chore Application - Completing and clearing chores
---------------------------------------------------------------

This covers EX-1, EX-2 and EX-3 and will involve modifying thisWeekView.js
and index.html (for EX-3). These examples focus on code that completes chores
and includes placeholders for you to add code that clears chores (EX-1, EX-2).
The EX-3 examples enables completing and clearing logic.

Working with Chore Application - Users
---------------------------------------

This covers EX-4, EX-5, EX-6 and EX-7 and will involve modifying usersViews.js.
The first part of this involves walking through how modals can be created
in the web browser, look at EX-4 (usersView.js) and chore.showModal and
chore.hideModal in choreUtils.js. The EX-5 and EX-6 demonstrate some ways to
clean up and remove global variables using JS closures and some other
techniques. The EX-7 enables add and edit user functionality.

Final thoughts
--------------

This session mostly focused on handling browser events, dealing with modals
and doing both with example code that closely mirrors line of business
applications. However, this was a 2 hour session so a bunch of material just
couldn't be covered in the allocated time. There are a bunch of bugs still
remaining in this application.

1) Doesn't handle api failures - if API returns an error message, currently
user won't see anything.
2) Doesn't handle slow api, ui permits user to create race conditions against
the api.
3) The dialogs don't reset properly, if you add a user and then add another
user you will see your previous input instead of a blank dialog.
4) The dialogs don't perform any validation.
5) Only the grid you edit is updated. If you edit the name of child, the
middle grid should refresh as well, but doesn't currently. If you edit a
chore, the bottom grid should refresh, but doesn't currently.

Those above bugs are fairly typical of the bugs your application might have
using any framework, you generally have to determine as an application how
you want your ui to handle/status those issues.