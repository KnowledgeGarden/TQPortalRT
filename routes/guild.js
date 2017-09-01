/**
 * Created by park on 5/28/2016.
 * Guilds are not conversation nodes
 * Guilds are indexed in rpg.hbs by way of aquests.js
 * View booleans:
 *   canJoin
 *     If <code>true</code>, user clicks a button to join
 *     Will default <code>true</code> unless:
 *      Guild is private -- invite only
 *      Not authenticated OR isMember
 */
 ///////////////////////
 // TODO
 //   Representing a Roster for a guild
 //   Displaying a Roster on the Guild page
 //   JOINING a Quest
 //   Displaying a Quest on the Guild page
 //   PLAYING a Quest -- guild controls
 //   LEAVING a Quest
 //   LATER
 //     Playing > 1 quest at a time
 //////////////////////
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers"),
    CwM = require("../apps/models/conwidget_model");

////////////////////////////
// A GuildOwner will have credentials e.g. <guildID>_OL
// A GuildLeader will have credentials e.g. <guildID>_L
// A GuildMember will have credentials e.g. <guildID>
////////////////////////////
const LEADER = "_L",
      OWNER_LEADER = "_OL";

exports.plugin = function(app, environment) {
    var CommonModel = environment.getCommonModel(),
        helpers = new Help(environment),
        GuildModel = environment.getGuildModel(),
        AdminModel = environment.getAdminModel(),
        ConwidgetModel = new CwM(environment);

    console.log("Guild "+ConwidgetModel);

    /**
     * Return <code>true</code> if <code>user</code>
     * is a member of a guild identified by <code>guildId</code>
     * @param guildId
     * @param user
     * @return boolean
     */
    function userIsMember(guildId, user) {
      var credentials = user.uRole,
          where = credentials.indexOf(guildId);
      console.log("MEMBER? "+guildId+" "+credentials);
      return (where > -1);
    };

    /**
     * add a member (possibly the owner) to a guild
     * @param req
     * @param guildId
     * @param user
     * @param callback
     */
    function addMemberToGuild(req, guildId, user, callback) {
      console.log("ADDMEMBER "+guildId+" "+JSON.stringify(user));
      var credentials = user.uRole;
          gid = guildId;
      if (Array.isArray(credentials)) {
        credentials.push(gid);
      } else {
        var c = [];
        c.push(credentials);
        c.push(gid);
        credentials = c;
      }
      user.uRole = credentials;
      //set back in session
      req.session[Constants.THE_USER] = user;
      AdminModel.addUserRole(user.uId, guildId, function gAx(err, rslt) {
        console.log("ADDEDMEMBER "+err);
        return callback(err);
      });
    };

    function addLeaderToGuild(req, guildId, user, isOwner, callback) {
      console.log("ADDGUILDLEADER "+guildId+" "+isOwner+" "+user);
      var credentials = user.uRole,
          gid = guildId;
      if (isOwner) {
        gid = gid+OWNER_LEADER;
      } else {
        gid = gid+LEADER;
      }
      //credentials is an array
      credentials.push(gid);

      user.uRole = credentials;
      //set back in session
      req.session[Constants.THE_USER] = user
      AdminModel.addUserRole(user.uId, gid, function gAy(err, rslt) {
        console.log("ADDEDLEADER "+err);
        return callback(err);
      });
    };

    function removeLeaderFromGuild(req, guildId, user, callback) {
      console.log("REMOVELEADER "+guildId+" "+JSON.stringify(user));
      //cannot remove the owner
      if (userIsOwner(guildId, user)) {
        return callback("Cannot remove owner");
      }
      var credentials = user.uRole;
      //ASSUME that credentials is an array
      Help.removeFromArray(credentials, guildId);
      user.uRole = credentials;
      //set back in session?
      req.session[Constants.THE_USER] =
      AdminModel.removeUserRole(user.uId, guildId, function gAa(err, rslt) {
        console.log("REMOVEDLEADER "+err);
        return callback(err);
      });
    };

    function removeMemberFromGuild(req, guildId, user, callback) {
      console.log("REMOVEMEMBER "+guildId+" "+JSON.stringify(user));
      //cannot remove the owner
      if (userIsOwner(guildId, user)) {
        return callback("Cannot remove owner");
      }
      var credentials = user.uRole;
      //ASSUME that credentials is an array
      Help.removeFromArray(credentials, guildId);

      user.uRole = credentials;
      //set back in session
      req.session[Constants.THE_USER] = user;
      AdminModel.removeUserRole(user.uId, guildId, function gA(err, rslt) {
        console.log("REMOVEDMEMBER "+err);
        return callback(err);
      });
    };

    function userIsOwner(guildId, user) {
      var credentials = user.uRole,
          where = credentials.indexOf(guildId+OWNER_LEADER);
      console.log("OWNER? "+guildId+" "+credentials);
      return (where > -1);
    }

    function userIsLeader(guildId, user) {
      var credentials = user.uRole,
          where = credentials.indexOf(guildId+LEADER);
      if (where === -1) {
        where = credentials.indexOf(guildId+OWNER_LEADER);
      }
      console.log("LEADER? "+guildId+" "+credentials);
      return (where > -1);
    }
    // a Guild does not show on the Menu
    /////////////
    // Routes
    /////////////

    app.get("/guild/:id", helpers.isPrivate, function(req, res) {
      var q = req.params.id;
      if (q) {
          var userId = req.session[Constants.USER_ID],
              userIP = "",
              theUser = helpers.getUser(req),
              sToken = req.session[Constants.SESSION_TOKEN],
              canJoin = true;
          CommonModel.fetchTopic(q, userId, userIP, sToken, function uFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                  data = CommonModel.populateTopic(rslt.cargo, theUser, data);
                  if (data.isAuthenticated) {
                    var isLeader = userIsLeader(q, theUser);
                    if (isLeader) {
                      canJoin = false;
                      data.isGuildMember = true;
                      data.isGuildLeader = true;
                    } else if (userIsMember(q, theUser)) {
                      canJoin = false;
                      data.isGuildMember = true;
                    }
                  } else {
                    //not authenticated
                    canJoin = false;
                  }
                  data.canJoin = canJoin;
                  if (canJoin) {
                    data.guildId = q;
                  }
                  data.guildId = q;
              }
              console.log("CANJOIN "+q+" "+canJoin);
              return res.render("guild", data);
          });
      } else {
          //That's not good!
          //TODO  alert stuff
          console.log("DANG "+q);
          req.flash("error", "Cannot get "+q);
          res.redirect("/");
      }
    });

    //From the Join Guild button
    app.get("/joinguild/:id", helpers.isPrivate, function(req, res) {
      var q = req.params.id,
          user = helpers.getUser(req),
          credentials = user.uRole;
      if (q) {
        addMemberToGuild(req, q, user, function gAM(err) {
          if (err) {
            req.flash("error", "Join error: "+err);
          }
          res.redirect("/guild/"+q);
        });

      } else {
        req.flash("error", "Cannot join "+q);
        res.redirect("/");
      }
    });

    app.get("/leaveguild/:id", helpers.isPrivate, function(req, res) {
      //TODO
    });

    app.get("/guildnew", helpers.isLoggedIn, function (req, res) {
        var data = environment.getCoreUIData(req);
        data.formtitle = "New Guild";
        data.isNotEdit = true;
        data.action = "/guild/new";
        return res.render("blogwikiform", data);
    });

    ///////////////////////////////
    // Guild leader functions
    ///////////////////////////////

    /**
     * Leader wants to start a new Quest by creating a new meta-conversation
     */
    app.get("/newmetamap/:id", function(req, res) {
      var q = req.params.id;
      console.log("NewMeta "+q);
      //TODO
    });

    /**
     * Leader has "Remeembered" a node
     */
    app.get("/selectrootnode/:id", function(req, res) {
      var q = req.params.id;
      console.log("SELROOT "+q);
      //TODO
    });

    app.get("/addleader/:id", function(req, res) {
      var q = req.params.id,
          userId = req.query.member;
      console.log("AddLeader "+q);
      //TODO
    });
    app.get("/removeleader/:id", function(req, res) {
      var q = req.params.id,
          userId = req.query.member;
      console.log("RemoveLeader "+q);
      //TODO
    });
    app.get("/addmember/:id", function(req, res) {
      var q = req.params.id,
          userId = req.query.member;
      console.log("AddMember "+q);
      //TODO
    });
    app.get("/removemember/:id", function(req, res) {
      var q = req.params.id,
          userId = req.query.member;
      console.log("RemoveMember "+q+" "+userId);
      //TODO
    });

    ///////////////////////////////
    // Playing a guilds game moves entails taking a game tree
    // they construct on some pre-selected root node
    // and moving that tree out and attaching it where it belongs
    // while at the same time making each node in that tree public
    // NOTE: open question: do we have to make guild's nodes private
    //   while under construction?
    ///////////////////////////////
    /**
     * Leader moves game moves out to the quest's game tree
     */
    app.get("/playmoves/:id", function(req, res) {
      var q = req.params.id;
      console.log("PLAY "+q);
      //TODO
    });

    var _guildsupport = function (req, body, user, userIP, sToken, callback) {
        if (body.locator === "") {
            GuildModel.create(body, user.uId, userIP, sToken, function (err, result) {
              //creator of a guild is a member
              console.log("GCCC "+JSON.stringify(result));
              var gld = result;
              addLeaderToGuild(req, gld. lox, user, true, function gnu(err) {
                return callback(err);
              });
            });
        } else {
            GuildModel.update(body, user.locator. userId, userIP, sToken, function (err, result) {
                return callback(err, result);
            });
        }
    };

    app.post("/guild/new", helpers.isLoggedIn, function (req, res) {
      var body = req.body,
          user = helpers.getUser(req),//req.session[Constants.USER_ID],
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("GUILD_NEW_POST " + JSON.stringify(user));
      _guildsupport(body, user, userIP, sToken, function (err) {
          console.log("GUILD_NEW_POST-1 " + err);
          return res.redirect("/rpg");
      });
   });
};
