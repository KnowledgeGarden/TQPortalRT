# Account User Structure #

## JSON User Object ##
{<br/>
&nbsp;&nbsp;"uGeoloc": "|",<br/>
&nbsp;&nbsp;"uEmail": "sam@slow.com",<br/>
&nbsp;&nbsp;"uHomepage": "",<br/>
&nbsp;&nbsp;"uName": "sam",<br/>
&nbsp;&nbsp;"uFullName": "Sam Slow",<br/>
&nbsp;&nbsp;"uRole": "rur, rar",<br/>
&nbsp;&nbsp;"uAvatar": ""<br/>
}<br/>
## Notes ##

- **uGeoloc** is the Geolocation of this user, expressed as &lt;lat>|&lt;long><br/>
- **uEmail** is this user's email address; used for authentication. A user has the option of changing this email value<br/> 
- **uHomepage** is the url of this user's homepage.<br/>
- **uName** is this user's *handle*. This handle *must be unique in the topic map*. It cannot be changed.<br/>
- **uFullName** is whatever full name the user chooses to enter.<br/>
- **uRole** is a list of permissions/roles assigned to this user.  The example shows that "rur" means this is a user and not a guest; "rar" means this user has been assigned an administrator role.  Other roles include group identifiers, which serve to allow the user to view specified groups or private topics.<br/>
- **uAvatar** is not presently used. It's purpose is intended to serve the needs of masking user identity when that user engages in, e.g. role-playing games where membership in game activities entails anonymity. <br/>

## TQPortalKS Uses ##

Two primary use cases:<br/>
- **Signup**: creation of a new account. During signup, an account is created, but a JSON User Object is not returned to the client.<br/>
- **Authentication**: logging in a user. If the authentication process (email + password) is successful, a JSON User Object is returned to the client.<br/>

TQPortalKS processes that JSON User Object in the file /routes/admin.js<br/>

Specifically, the method **finishAuthenticate** stores the entire JSON User Object, and specific components of it into a Session object for later use.

As a practical illustration, consider the file /apps/models/common_model.js

The function **fetchTopic** takes the entire JSON User Object in its signature. There, it pulls out the user's Id for fetching the topic from the topic map. Later, it uses the entire object for population of the view; specifically, it must determine, from the user's roles, whether this user is qualified to edit this topic.

To see how that works, consider the file /routes/blog.js

The function  **app.get('/blog/:id'**... pulls the user object from the Session, and passes it to **fetchTopic**.

