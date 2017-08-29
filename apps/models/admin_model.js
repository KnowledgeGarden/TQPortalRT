/**
 * Created by park on 11/16/2015.
 */

var AdminModel =  module.exports = function(environment) {
    var self = this,
        userDriver = environment.getUserDriver();
    console.log("AdminModel "+userDriver);

    ///////////////////
    //API
    //////////////////


    ///////////////////////////
    // Authentication
    ///////////////////////////

    self.logout = function(sessionToken, callback) {
      userDriver.logout(sessionToken, function aLO(err, rslt) {
          return callback(err, rslt);
      });
    };
    /**
     * <p>Login the user represented in <code>request</code></p>
     * <p>Returns a SessionToken if authentication succeeds</p>
     * @param request
     * @param callback signature(err, result)
     */
    self.login = function(request, callback) {
      var email = request.body.email,
          password = request.body.password;
      //console.log("AUTH "+email+" "+password);
      userDriver.login(email, password, function aML(err, rslt) {
          console.log("AdminModelLogin "+JSON.stringify(rslt));
          return callback(err, rslt);
      });
    };

    ///////////////////////////
    // Invitations
    ///////////////////////////
    /**
     * <p>Return <code>true</code> if there is an existing invitation for
     * the given <code>email</code>
     * @param email
     * @param callback
     * @returns {*}
     */
    self.hasInvitation = function(email, callback) {
      userDriver.existsInvite(email, function addInv(err, rslt) {
          console.log("AdminModel.hasInvitation "+err+" "+JSON.stringify(rslt));
          return callback(err, rslt);
      });
    };

    /**
     * Remove the invitation for the given <code>email</code>
     * @param email
     * @param callback signature (err)
     */
    self.removeInvitation = function(email, callback) {
      userDriver.removeInvite(email, function addInv(err) {
          return callback(err);
      });
    };

    /**
     * Add an invitation for the given <code>email</code>
     * @param email
     * @param callback signature(err)
     */
    self.addInvitation = function(email, callback) {
      console.log("AdminModel.addInvitation "+email);
      userDriver.createInvite(email, function addInv(err) {
          return callback(err);
      });
    };
    ///////////////////////////
    // Accounts
    ///////////////////////////

    /**
     * Return <code>true</code> if <code>handle</code> is unique in
     * user database;
     * @param handle
     * @param callback signature (err, result)
     */
    self.handleUnique = function(handle, callback) {
      userDriver.validateHandle(handle, function unique(err, truth) {
          return callback(err, truth);
      });
    };

    self.existsEmail = function(email, callback) {
      userDriver.existsEmail(email, function unique(err, truth) {
          return callback(err, truth);
      });
    };

    /**
     * Create an account for the individual represented in <code>request</code>
     * @param request
     * @param callback signature (err, result)
     */
    self.createAccount = function(request, callback) {
      var result;
      var handle = request.body.handle,
          email = request.body.email,
          password = request.body.password,
          fullname = request.body.fullname;
      if (fullname === "") {
          fullname = "no name given";
      }
      console.log("AdminModel.createAccount "+email+" | "+
          fullname+" | "+
          handle+" | "+
          request.body.avatar+" | "+
          request.body.homepage);
      //validate handle -1
      //Sanity checks
      console.log("XXX "+email);
      if (email === "") {
          return callback("MissingEmail", result);
      }
      self.existsEmail(email, function mEE(err, truth) {
        console.log("TRUTH "+truth);

        if (!truth) {
            if (handle === "") {
                return callback("HandleRequired", result);
            }
            if (password === "") {
                return callback("MissingPassword", result)
            }
            if (handle.indexOf(" ") > -1) {
                console.log("BAD HANDLE " + handle);
                return callback("BadHandle", result);
            }
            self.handleUnique(handle, function (err, truth) {
                console.log("SIGNUP-VALIDATE " + JSON.stringify(truth));
                //SIGNUP VALIDATE {"rMsg":"not found","rToken":""}
                var msg = truth.rMsg;
                console.log("SS " + msg);
                if (msg === "ok") {
                    return callback("HandleExists", result);
                }
                //otherwise continue
                var avatar = request.body.avatar,
                    homepage = request.body.homepage,
                    latitude = request.body.Latitude,
                    longitude = request.body.Longitude;
                console.log("SS2");
                userDriver.signup(email, fullname, handle, password, avatar, homepage,
                    latitude, longitude, function adminMSignup(err, rslt) {
                        return callback(err, rslt);
                    });
            });
        } else {
            return callback("EmailExists", result);
        }
      });
    };

    /**
     * Fetch user identified by <code>email</code> strictly for administrative
     * purposes -- from the user database
     * NOTE: this is an account user, <em>not</em> the topic map's representation of this user
     * @param email
     * @param callback signature (err, result)
     */
    self.getUser = function(email, callback) {
        userDriver.fetchUser(email, function uaGu(err, rslt) {
            console.log("AdminModel.getUser "+err+" | "+JSON.stringify(rslt));
            return callback(err, rslt);
        });
    };

    self.removeUser = function(userId, callback) {
        userDriver.removeUser(userId, function uaGu(err, rslt) {
            console.log("AdminModel.removeUser "+err+" | "+JSON.stringify(rslt));
            return callback(err, rslt);
        });
    };

    /**
     * Update a user's roles by comparison of <code>changedRoles</code>
     * to the user's current roles -- select addRole or removeUserRole
     * @param userEmail
     * @param userId
     * @param changedRoles
     * @param callback
     * /
    self.updateUserRole = function(userEmail, userId, changedRoles, callback) {
      self.getUser(email, function umgu(err, rslt) {
        var usr = rslt.cargo,
            oldRoles = usr.uRole;

      });
    };
    */

    self.addUserRole = function(userId, newRole, callback) {
        userDriver.addUserRole(userId, newRole, function uaUrr(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.removeUserRole = function(userId, oldRole, callback) {
        userDriver.removeUserRole(userId, oldRole, function urUrr(err, rslt) {
            return callback(err, rslt);
        });
    };

    /**
     * Returns a JSON list of users for admin view into user database
     * @param start
     * @param count
     * @param callback signature (err, json)
     */
    self.fillUserDatatable = function(start, count, callback) {
         userDriver.listUsers(start, count, function uaLu(err, rslt) {
             console.log("UserAdmin.fillUserDatatable "+err+" | "+JSON.stringify(rslt));
             return callback(err, rslt);
        });
        ///////////////////////////////////////// uName is now id
        //UserAdmin.fillUserDatatable undefined | {"rMsg":"ok","rToken":"","cargo":[{"uGeo
        //loc":"","uEmail":"TestUser@foo.org","uHomepage":"","uName":"defaultadmin","uFull
        //Name":"Default Admin","uRole":"rar, ror","uAvatar":""},{"uGeoloc":"|","uEmail":"
        //sam@slow.com","uHomepage":"","uName":"sam","uFullName":"Sam Slow","uRole":"rur",
        //"uAvatar":""},{"uGeoloc":"|","uEmail":"jackpark@gmail.com","uHomepage":"","uName
        //":"jackpark","uFullName":"Jack Park","uRole":"rur","uAvatar":""},{"uGeoloc":"|",
        //"uEmail":"joe@sixpack.com","uHomepage":"","uName":"joe","uFullName":"Joe Sixpack
        //","uRole":"rur","uAvatar":""}]}
     };

    self.fillInviteTable = function(start, count, callback) {
        userDriver.listInvites(start, count, function uaLu(err, rslt) {
            console.log("UserAdmin.fillInviteTable "+err+" | "+JSON.stringify(rslt));
            var c = rslt.cargo;
            var result = [];
            if (c) {
                var len = c.length;
                var o;
                for (var i=0;i<len;i++) {
                    o = {};
                    o.email = c[i];
                    result.push(o);
                }
            }
            return callback(err, result);
        });

    };

    ///////////////////////////
    // Profile
    ///////////////////////////
    self.updateUserEmail = function(userId, newEmail, sessionToken, callback) {
        userDriver.changeUserEmail(userId, newEmail, sessionToken, function uaCem(err, rslt) {
            return callback(err, rslt);
        });
    };


    self.updateUserGeolocation = function(userId, latitude, longitude, sessionToken, callback) {
        userDriver.changeUserGeolocation(userId, latitude, longitude, sessionToken, function uaCgl(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.updateUserHomepage = function(userId, url, sessionToken, callback) {
        userDriver.changeUserHomepage(userId, url, sessionToken, function uaChp(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.migrateUserId = function(oldId, newId, callback) {
      userDriver.migrateUserId(oldId,newId, function uaMM(err, rslt) {
        return callback(err, rslt);
      });
    };

    self.changePwd = function(newPwd, sessionToken, callback) {
      userDriver.changePwd(newPwd, sessionToken, function uaMM(err, rslt) {
        return callback(err, rslt);
      });

    }

};
