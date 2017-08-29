/**
 * Created by park on 12/31/2015.
 * SESSION OBJECTS USED HERE:
 *  transclude = locator for node to transclude
 *  tevidence = locator for node to transclude as evidence
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        ConversationModel = environment.getConversationModel(),
        CommonModel = environment.getCommonModel();

    console.log("Conversation "+ConversationModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/conversation","Conversation");
    /////////////
    // Routes
    /////////////

    /**
     * GET conversation index
     */
    app.get("/conversation", helpers.isPrivate, function(req, res) {
        var start = helpers.validateNumber(parseInt(req.query.start)),
            count = helpers.validateCount(parseInt(req.query.count));
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("Conversation "+start+" "+count);

        var userId= helpers.getUserId(req),
            userIP= "",
            sToken= null,
            usx = helpers.getUser(req),
            credentials = usx.uRole;

        ConversationModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Conversation.index "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render("conversationindex", json);
        });
    });

    app.get("/convnext/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("ConvNext: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      ConversationModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Conv.index "+countsent+" "+data);
          var cursor = start+countsent,
              json = environment.getCoreUIData(req);
          //pagination is based on start and count
          //both values are maintained in an html div
          json.start = cursor;
          json.count = Constants.MAX_HIT_COUNT; //pagination size
          json.total = totalavailable;
          json.cargo = data.cargo;
          if (cursor > 0) {
            var ret = cursor - count;
            if (ret < 0)
              ret = 0;
            json.ret = ret;
          }
          return res.render("conversationindex", json);
      });
    });
    app.get("/convprev/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("ConvPrev: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      ConversationModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Conv.index "+countsent+" "+data);

          var cursor = start+countsent,
              json = environment.getCoreUIData(req);
          //pagination is based on start and count
          //both values are maintained in an html div
          json.start = cursor;
          json.count = Constants.MAX_HIT_COUNT; //pagination size
          json.total = totalavailable;
          json.cargo = data.cargo;
          if (cursor > 0) {
            var ret = cursor - count;
            if (ret < 0)
              ret = 0;
            json.ret = ret;
          }
          return res.render("conversationindex", json);
      });
    });

    app.get("/conversation/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        if (!contextLocator) {
          contextLocator = q;
        }
        console.log("GETCONx "+q+" "+contextLocator);
        if (q) {
            var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
                userIP = "",
                theUser = helpers.getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
///////////////////////////////
//TODO
// THIS entire section is subject to revision as the
// ConversationWidget is spliced in -- or all this code is replaced
///////////////////////////////
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req),
                    language = "en"; // TODO
                data.language = language;
                if (rslt.cargo) {
                  CommonModel.populateConversationTopic(rslt.cargo, contextLocator, theUser, "/conversation/", userIP, sToken,
                          data, function bC(err, rslt) {
                  data = rslt;
                  console.log("BOOBOOBOO "+JSON.stringify(data));
                  helpers.checkContext(req, data);
                  helpers.checkTranscludes(req, data);
                  //data for response buttons
                  data.locator = q;
                  if (contextLocator && contextLocator !== "") {
                      data.context = contextLocator;
                  } else {
                      data.context = q; // we are talking about responding to this blog
                  }
                  // deal with editing
                  var canEdit = false;
                  console.log("CANEDIT "+userId+" | "+data.userid+" | "+data.isAdmin);
                  if (helpers.isLoggedIn) {
                    if (userId === data.userid || data.isAdmin) {
                      canEdit = true;
                    }
                  }
                  data.canEdit = canEdit;
                  data.editurl = "/conversationedit/"+q;
                  return res.render("ctopic", data);
                  });
                } else {
                  req.flash("error", "Cannot get "+q);
                  res.redirect("/");
                }

            });
        } else {
          console.log("FOOIE "+q);
          req.flash("error", "Cannot get "+q);
            //That's not good!
          res.redirect("/");
        }
    });
    /**
     * GET new blog post form
     * WE GET HERE FROM A BOOKMARKLET
     */
    app.get("/conversationnew", helpers.isLoggedIn, function(req, res) {
        var query = req.query,
            data =  environment.getCoreUIData(req);
        data.formtitle = "New Conversation";
        data.nodeicon = Constants.MAP;
        data.nodeType = Constants.CONVERSATION_MAP_TYPE;
        data.isNotEdit = true;
        data.url = query.url; //TODO likely not for here, for bookmarks
        data.title = query.title;
        data.action = "/conversation/new";
        return res.render("conversationform", data); //,
    });

    /**
     * Capture <code>id</code> and save to Session for later transclusion
     */
    app.get("/remember/:id", helpers.isLoggedIn, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        req.session.transclude = q;
        req.session.context = contextLocator;
        //save it to session
        req.flash("error", "Topic remembered");
        return res.redirect("/");
    });

    /**
     * Transclude a remembered topic
     */
    app.post("/transclude/", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            //contextLocator = req.query.contextLocator,
            userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN];
        //body.contextLocator = contextLocator;
        console.log("TRANSCLUDING "+JSON.stringify(body));
        //TRANSCLUDING 4936540b-693c-44a1-a3db-ea439df0eb5b | 4936540b-693c-44a1-a3db-ea439df0eb5b
        if (body.contextLocator !== "" && body.transcludelocator !== "") {
          ConversationModel.transclude(body, false, userId, userIP, sToken, function ctT(err, rslt) {
            req.session.transclude = null;
            req.query.contextLocator = null;
            return res.redirect("/topic/"+body.locator);
          });
        } else {
          //That's not good!
          req.flash("error", "Missing Transclude Identity");
          res.redirect("/");
        }

    });

    app.get("/transcludeevidence/:id", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            //contextLocator = req.query.contextLocator,
            userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN];
        //body.contextLocator = contextLocator;
        if (body.contextLocator !== "" && body.transcludelocator !== "") {
            ConversationModel.transclude(body, t, true, userId, userIP, sToken, function ctT(err, rslt) {
              req.session.transcludeevidence = null;
              req.query.contextLocator = null;
              return res.redirect("/topic/"+body.locator);
            });
        } else {
          //That's not good!
          req.flash("error", "Missing Transclude Identity");
          res.redirect("/");
        }
    });


    /**
     * Capture <code>id</code> and save to Session for later transclusion as evidence
     */
    app.get("/rememberevidence/:id", helpers.isLoggedIn, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        req.session.tevidence = q;
        req.session.context = contextLocator;
        req.flash("error", "Topic remembered as evidence");
        return res.redirect("/");
    });

    ////////////////////////////////////
    // RESPONDING TO NODES WITH CONVERSATION
    // Based on buttons with an href, e.g.
    //  /newquestion/<someId>?contextLocator=<somecontextlocator>
    /////////////////////////////////////
    app.get("/newquestion/:id", helpers.isLoggedIn, function(req, res) {
        var q = req.params.id, //parent locator
            contextLocator = req.query.contextLocator, // context loator
            data =  environment.getCoreUIData(req);
        data.formtitle = "New Question";
        data.nodeicon = Constants.ISSUE;
        data.nodeType = Constants.ISSUE_TYPE;
        data.parent = q;
        data.context = contextLocator;
        data.isNotEdit = true;
        data.action = "/conversation/new";
        return res.render("conversationform", data); //,

    });

    app.get("/newanswer/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Answer";
      data.nodeicon = Constants.POSITION;
      data.nodeType = Constants.POSITION_TYPE;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,

    });
    app.get("/newpro/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Pro Argument";
      data.nodeicon = Constants.PRO;
      data.nodeType = Constants.PRO_TYPE;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,
    });

    app.get("/newcon/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Con Argument";
      data.nodeicon = Constants.CON;
      data.nodeType = Constants.CON_TYPE;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,
    });
    app.get("/newreference/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id, //parent locator
          contextLocator = req.query.contextLocator, // context loator
          data =  environment.getCoreUIData(req);
      data.formtitle = "New Reference";
      data.nodeicon = Constants.REFERENCE;
      data.nodeType = Constants.REFERENCE_TYPE;
      data.isURL = true;
      data.parent = q;
      data.context = contextLocator;
      data.isNotEdit = true;
      data.action = "/conversation/new";
      return res.render("conversationform", data); //,
    });

    /**
     * PROBABLY NOT USED in favor of newquestion,newanswer, ...
     * Create a conversation child node
     * where query is /conversationrespond/<type>:<locator>
     */
    app.get("conversationrespond/:type", helpers.isPrivate, function(req, res) {
        var q = req.params.type,
            v = q.split(":"),
            type = v[0].trim(),
            lox = lox = v[1].trim();
        console.log("ConversationRespond "+type+" "+lox);
        //TPDP
    });

    app.get("/conversationedit/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id,
          contextLocator = req.query.contextLocator,
          language = "en"; //TODO we need to deal with language
      console.log("ConversationEdit "+q+" "+contextLocator);
      if (q) {
          var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
              theUser = helpers.getUser(req),
              userIP = "",
              sToken = req.session[Constants.SESSION_TOKEN];
          CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                console.log("CARGO "+JSON.stringify(rslt.cargo));
                data.action = "/conversation/edit";
                data.formtitle = "Edit Conversation Node";
                data.locator = q; // this makes the form know it's for editing
                data.title = "Title editing is disabled"; //rslt.cargo.label;
                data.language = language;
                data.body = rslt.cargo.details;
                //TODO
                return res.render("blogwikiform", data);
              }
          });
        } else {
            //That's not good!
            req.flash("error", "Cannot get "+q);
            res.redirect("/");
        }
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _consupport = function(json, isPrivate, userId, userIP, sToken,  callback) {
        if (json.locator === "") {
            ConversationModel.create(json, isPrivate, userId, userIP, sToken, function blsA(err, result) {
                return callback(err, result);
            });
        } else {
            ConversationModel.update(json, userId, userIP, sToken, function cl(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post("/conversation/new", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN],
            isPrivate = false; //TODO
        console.log("CONVERSATION_NEW_POST "+JSON.stringify(body));
        _consupport(body, isPrivate, userId, userIP, sToken, function cP(err, result) {
            console.log("CONVERSATION_NEW_POST-1 "+err+" "+result);
            return res.redirect("/conversation");
        });
    });

    app.post("/conversation/edit", helpers.isLoggedIn, function(req, res) {
      var body = req.body,
          userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("ConvEditPost "+JSON.stringify(body));
      _consupport(body, false, userId, userIP, sToken, function ceP(err, result) {
         console.log("CONV_EDIT_POST-2 "+err+" "+result);
         return res.redirect("/conversation");
     });
    });
};
