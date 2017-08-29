/**
 * Created by park on 11/26/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        isPrivatePortal = environment.getIsPrivatePortal(),
        WikiModel = environment.getWikiModel(),
        CommonModel = environment.getCommonModel();
    console.log("Wiki " + WikiModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/wiki", "Wiki");
    /////////////
    // Routes
    /////////////


    /**
     * GET wiki index
     */
    app.get("/wiki", helpers.isPrivate, function (req, res) {
        var start = helpers.validateNumber(parseInt(req.query.start)),
            count = helpers.validateCount(parseInt(req.query.count)),
            userId = helpers.getUserId(req),
            userIP = "",
            sToken = null,
            usx = helpers.getUser(req),
            credentials = usx.uRole;

        WikiModel.fillDatatable(start, count, userId, userIP, sToken, function wikiFill(err, data, countsent, totalavailable) {
            console.log("Wiki.index " + data);
            var cursor = start + countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render("wikiindex", json);
        });
    });

    app.get("/wiki/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        if (!contextLocator) {
          contextLocator = q;
        }
      console.log("GETWIKI"+q);
        if (q) {
            var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
                userIP = "",
                theUser = helpers.getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                  CommonModel.populateConversationTopic(rslt.cargo, contextLocator, theUser, "/blog/", userIP, sToken,
                              data, function bC(err, rslt) {
                      data = rslt;
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
                      data.editurl = "/wikiedit/"+q;
                      return res.render("ctopic", data);
                  });
                }  else {
                  req.flash("error", "Cannot get "+q);
                  res.redirect("/");
                }
            });
        } else {
            //That's not good!
            req.flash("error", "Cannot get "+q);
            res.redirect("/");
        }
    });

    app.get("/wikinext/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("WikiNext: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      WikiModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Wiki.index "+countsent+" "+data);
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
          return res.render("wikiindex", json);
      });
    });
    app.get("/wikiprev/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("WikiPrev: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      WikiModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Wiki.index "+countsent+" "+data);

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
          return res.render("wikiindex", json);
      });
    });
    /**
     * GET new wiki post form
     */
    app.get("/wikinew", helpers.isLoggedIn, function (req, res) {
        var data = environment.getCoreUIData(req);
        data.formtitle = "New Wiki Topic";
        data.isNotEdit = true;
        data.action = "/wiki/new";
        return res.render("blogwikiform", data);
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _wikisupport = function (body, userId, userIP, sToken, callback) {
        if (body.locator === "") {
            WikiModel.createWikiTopic(body, userId, userIP, sToken, function (err, result) {
                return callback(err, result);
            });
        } else {
            WikiModel.update(body, userId, userIP, sToken, function (err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new wiki topio
     */
    app.post("/wiki/new", helpers.isLoggedIn, function (req, res) {
        var body = req.body,
            userId = helpers.getUserId(req),
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN];
        console.log("WIKI_NEW_POST " + JSON.stringify(body));
        _wikisupport(body, userId, userIP, sToken, function (err, result) {
            console.log("WIKI_NEW_POST-1 " + err + " " + result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/wiki");
        });
    });

    app.get("/wikiedit/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id,
          contextLocator = req.query.contextLocator,
          language = "en"; //TODO we need to deal with language
      console.log("WikiEdit "+q+" "+contextLocator);
      if (q) {
          var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
              theUser = helpers.getUser(req),
              userIP = "",
              sToken = req.session[Constants.SESSION_TOKEN];
          CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                console.log("CARGO "+JSON.stringify(rslt.cargo));
                data.action = "/wiki/edit";
                data.formtitle = "Edit Wiki Topic";
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

    app.post("/wiki/edit", helpers.isLoggedIn, function(req, res) {
      var body = req.body,
          userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("WikiEditPost "+JSON.stringify(body));
      _wikisupport(body, userId, userIP, sToken, function(err,result) {
         console.log("WIKI_EDIT_POST-2 "+err+" "+result);
         //technically, this should return to "/" since Lucene is not ready to display
         // the new post; you have to refresh the page in any case
         return res.redirect("/wiki");
     });
    });

};
