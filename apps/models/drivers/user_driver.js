/**
 * Created by park on 11/16/2015.
 */
var Qu = require('./query_util'),
    Constants = require('../../constants');

var UserDriver =  module.exports = function(environment) {

    var self = this,
        httpClient = environment.getHttpClient(),
        queryUtil = new Qu();
    console.log("UserDriver "+httpClient);
    /**
     * Base64 copied from node-browser-compat/btoa on github
     * @param str (a password)
     * @return base64
     */
    function btoa(str) {
        console.log("BTOA1 "+str);
        var buffer = new Buffer(str.toString(), 'binary');
        console.log("BTOA2 "+buffer);
        return buffer.toString('base64');
    };
    ///////////////////////////////
    //API
    ///////////////////////////////

    self.logout = function(sessionToken, callback) {
        var urx = '/auth/',
            verb = Constants.LOGOUT,
            query =  queryUtil.getCoreQuery(verb, "SystemUser", '', sessionToken);
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };
    /**
     *Authenticate a user
     * #param userEmail
     * @param password
     * @param callback signature (error, userProfile)
     */
    self.login = function(userEmail, password, callback) {
        var verb = Constants.AUTHENTICATE,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);

        httpClient.authenticate
        (query, userEmail, password, function udAuth(err, rslt) {
            console.log("UserDriverLogin "+JSON.stringify(rslt));
            return callback(err, rslt);
        });
    };

    /**
     * Validate a new user's candidate handle, which must be
     * <em>unique</em> in the topic map as a topic locator.
     * <code>true</code> if unique
     * @param handle
     * @param callback signature (err, truth)
     */
    self.validateHandle = function(handle, callback) {
        var urx = '/auth/',
            verb = Constants.VALIDATE,
            query = queryUtil.getCoreQuery(verb, handle, '', null);
        console.log("VALIDATE "+handle);
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            var msg = rslt.rMsg;
            //will be true if the username does not exist
            return callback(err, (msg === "ok"));
        });
    };

    self.existsEmail = function(email, callback) {
        var urx = '/auth/',
            verb = Constants.EXISTS_EMAIL,
            query = {};
        query.verb = verb;
        query.uIP = '';
        query.uEmail = email;
        query.sToken = '';
        console.log("EXISTSEMAIL "+email);
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            var msg = rslt.rMsg;
            //will be true if this email does exist
            return callback(err, (msg === "ok"));
        });
    };

    self.migrateUserId = function(oldId, newId, callback) {
      var urx = '/admin/',
          verb = "MigrateUsrId",
          query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
      query.oldId = oldId;
      query.newId = newId;
      query.sToken = '';
      httpClient.post(urx, query, function udM(err, rslt) {
          return callback(err, rslt);
      });
    };
    /**
     * <p>Register a new user account, which also creates a topic in the topic map
     * for that user.</p>
     * <p>We are here because we already checked if this is an inviteOnly portal
     * and an invitation is available</p>
     * @param email  required
     * @param fullName required
     * @param handle required
     * @param password required
     * @param avatar  can be <code>null</code>
     * @param homepage (URL) can be <code>null</code>
     * @param latitude (geo) can be <code>null</code>
     * @param longitude (geo) can be <code>null</code>
     * @param callback signature(err, result)
     */
    self.signup = function(email, fullName, handle, password, avatar,
                     homepage, latitude, longitude, callback) {
        var urx = "/user/",
            verb = Constants.NEW_USER,
            query = queryUtil.getCoreQuery(verb, 'SystemUser', '', null);
        query.uEmail = email;
        query.uName = handle;
        query.uFullName = fullName;
        if (avatar === null) {
            query.uAvatar = '';
        } else {
            query.uAvatar = avatar;
        }
        query.uPwd = btoa(password);
        if (longitude === null) {
            query.uGeoLoc = '';
        } else {
            query.uGeoloc = latitude + "|" + longitude;
        }
        query.uHomepage = '';
        if (homepage !== '') {
            query.uHomepage = encodeURI(homepage);
        }
        console.log("SIGNUP! "+JSON.stringify(query));
        httpClient.post(urx, query, function udSU2(err, rslt) {
            return callback(err, rslt);
        });
    };

    /**
     * Add an <code>email</code> to the invited database
     * @param email
     * @param callback signature(err)
     */
    self.createInvite = function(email, callback) {
        var urx = '/admin/',
            verb = Constants.NEW_INVITE,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.uEmail = email;
        httpClient.post(urx, query, function udCI(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.existsInvite = function(email, callback) {
        var urx = '/admin/',
            verb = Constants.EXISTS_INVITE,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.uEmail = email;
        console.log("UserDriver.existsInvite "+email+" "+JSON.stringify(query));
        httpClient.get(urx, query, function udCI(err, rslt) {
            return callback(err, rslt);
        });
    }

    /**
     * Remove a <code>email</code> from the invited database
     * @param email
     * @param callback signature (err)
     */
    self.removeInvite = function(email, callback) {
        var urx = '/admin/',
            verb = Constants.REMOVE_INVITE,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.uEmail = email;
        httpClient.post(urx, query, function udRI(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.listInvites = function(start, count, callback) {
        var urx = '/admin/',
            verb = Constants.LIST_INVITES,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.from = start.toString();
        query.count = count.toString();
        httpClient.get(urx, query, function udLI(err, rslt) {
            return callback(err, rslt);
        });
    };

    /**
     * For admin messing with roles
     */
    self.listUsers = function(start, count, callback) {
        var urx = '/user/',
            verb = Constants.LIST_USERS,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.from = start.toString();
        query.count = count.toString();
        httpClient.get(urx, query, function udLI(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.fetchUser = function(email, callback) {
        var urx = '/user/',
            verb = Constants.GET_USER,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.uEmail = email;
        httpClient.get(urx, query, function udFu(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.removeUser = function(userId, callback) {
        var urx = '/user/',
            verb = Constants.REMOVE_USER,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.id = userId;
        httpClient.post(urx, query, function udLI(err, rslt) {
            return callback(err, rslt);
        });
    };
    /**
     * for admins only
     * @param userHandle -- NOT the id of the logged in user; rather the user being updated
     * @param newRole
     * @param callback signature (err, rslt)
     */
    self.addUserRole = function(userId, newRole, callback) {
        var urx = '/admin/',
            verb = Constants.UPDATE_ROLE,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.uRole = newRole;
        query.uId = userId;
        console.log("UserDriver.addUserRole "+JSON.stringify(query));
        httpClient.post(urx, query, function udLI(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.removeUserRole = function(userId, oldRole, callback) {
        var urx = '/admin/',
            verb = Constants.REMOVE_ROLE,
            query = queryUtil.getCoreQuery(verb, "SystemUser", '', null);
        query.uRole = oldRole;
        query.uId = userId;
        console.log("UserDriver.removeUserRole "+JSON.stringify(query));
        httpClient.post(urx, query, function udLI(err, rslt) {
            return callback(err, rslt);
        });
    };
///////////////////////////////
// User Profile
///////////////////////////////
    /**
     * for users
     */
    self.changeUserEmail = function(userId, newEmail, sessionToken, callback) {
        var urx = '/admin/',
            verb = Constants.UPDATE_EMAIL,
            query = queryUtil.getCoreQuery(verb, userId, '', sessionToken);
        query.uEmail = newEmail;
        httpClient.post(urx, query, function udCue(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.changeUserPassword = function(userId, newPwd, sessionToken, callback) {
        var urx = '/user/',
            verb = Constants.UPDATE_PASSWORD,
            query = queryUtil.getCoreQuery(verb, userId, '', sessionToken);
        query.uPwd = btoa(newPwd);
        httpClient.post(urx, query, function udCup(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.changeUserHomepage = function(userId, newURL, sessionToken, callback) {
        var urx = '/user/',
            verb = Constants.UPDATE_USER_DATA,
            query = queryUtil.getCoreQuery(verb, userId, '', sessionToken);
        query.pKey = "uHomepage";
        query.pVal = newURL;
        httpClient.post(urx, query, function udCup(err, rslt) {
            return callback(err, rslt);
        });

    };

    self.changeUserGeolocation = function(userId, newLatitude, newLongitude, sessionToken, callback) {
        var urx = '/user/',
            verb = Constants.UPDATE_USER_DATA,
            query = queryUtil.getCoreQuery(verb, userId, '', sessionToken);
        query.pKey = "uGeoloc";
        query.pVal = newLatitude+'|'+newLongitude;
        httpClient.post(urx, query, function udCup(err, rslt) {
            return callback(err, rslt);
        });
    };

  /*  self.changePwd = function(newPwd, sessionToken, callback) {

  }; */
};
