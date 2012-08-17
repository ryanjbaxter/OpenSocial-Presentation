OpenSocial Presentation

About
This project contians both a gadget and a container used to present the basic
concepts behind OpenSocial.  The container uses the common container code from
Shindig and is a very basic container.

To Build
To build this project you need to install Apache Maven and run a maven build.
The build will produce a WAR file which you can then run on an J2EE web container
like Tomcat or Jetty.

Using OAuth
To get the sample OAuth request to work you need to register for an OAuth key and
secret.  You can do that at https://code.google.com/apis/console.  After you create
your project you need to enable the Google+ API under the Services tab.  Under the API
access tab, you need to create a client id for a web application.  After your client id
is created click edit settings and and enter http://localhost:8080/gadgets/oauth2callback
as a redirect URI.