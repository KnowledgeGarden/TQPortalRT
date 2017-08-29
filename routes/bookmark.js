/**
 * Created by park on 12/31/2015.
 */

var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        BookmarkModel = environment.getBookmarkModel(),
        CommonModel = environment.getCommonModel();

    console.log("Bookmark "+BookmarkModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/bookmark","Bookmark");
    /////////////
    // Routes
    /////////////
    // Bookmarklet
    // javascript:location.href='http://localhost:3000/bookmarknew?url='+
    //     encodeURIComponent(location.href)+'&title='+ encodeURIComponent(document.title)

    /**
     * GET blog index
     */
    app.get("/bookmark", helpers.isPrivate, function(req, res) {
        var start = helpers.validateNumber(parseInt(req.query.start)),
            count = helpers.validateCount(parseInt(req.query.count));
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("Bookmark "+start+" "+count);

        var userId= helpers.getUserId(req),
            userIP= "",
            sToken= null,
            usx = helpers.getUser(req),
            credentials = usx.uRole;

        BookmarkModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Bookmark.index "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.ret = 0; //TODO
            json.cargo = data.cargo;
            return res.render("bookmarkindex", json);
        });
    });

    app.get("/bookmarknext/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("BookmarkNext: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      BookmarkModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Bookmark.index "+countsent+" "+data);
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
          return res.render("bookmarkindex", json);
      });
    });
    app.get("/bookmarkprev/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("BookmarkPrev: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      BookmarkModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Bookmark.index "+countsent+" "+data);

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
          return res.render("bookmarkindex", json);
      });
    });

    app.get("/bookmark/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        console.log("GETBLOG "+q);
        if (q) {
            var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
                theUser = helpers.getUser(req),
                userIP = "",
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                    data = CommonModel.populateTopic(rslt.cargo, theUser, data);
                }
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
                data.editurl = "/bookmarkedit/"+q;

                return res.render("ctopic", data);
            });
        } else {
            //That's not good!
            req.flash("error", "Cannot get "+q);
            res.redirect("/");
        }
    });
    /**
     * GET new blog post form
     * WE GET HERE FROM A BOOKMARKLET
     */
    app.get("/bookmarknew", helpers.isLoggedIn, function(req, res) {
        var query = req.query,
            data =  environment.getCoreUIData(req);
        data.formtitle = "New Bookmark";
        data.isNotEdit = true;
        data.url = query.url;
        data.title = query.title;
        data.action = "/bookmark/new";
        console.log("BM "+data.url);
        return res.render("blogwikiform", data); //,
    });

    app.get("/bookmarkedit/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id,
          contextLocator = req.query.contextLocator,
          language = "en"; //TODO we need to deal with language
      console.log("BlogEdit "+q+" "+contextLocator);
      if (q) {
          var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
              theUser = helpers.getUser(req),
              userIP = "",
              sToken = req.session[Constants.SESSION_TOKEN];
          CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                console.log("CARGO "+JSON.stringify(rslt.cargo));
                data.action = "/bookmark/edit";
                data.formtitle = "Edit Bookmark";
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
    var _bookmarksupport = function(body, userId, userIP, sToken,  callback) {
        if (body.locator === "") {
            BookmarkModel.createBookmark(body, userId, userIP, sToken, function blsA(err, result) {
                return callback(err, result);
            });
        } else {
            BookmarkModel.update(body, userId, userIP, sToken, function blSB(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post("/bookmark/new", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN];
        console.log("BOOKMARK_NEW_POST "+JSON.stringify(body));
        _bookmarksupport(body, userId, userIP, sToken, function bP(err,result) {
            console.log("BOOKMARK_NEW_POST-1 "+err+" "+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/bookmark");
        });
    });

    app.post("/bookmark/edit", helpers.isLoggedIn, function(req, res) {
      var body = req.body,
          userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("BlogEditPost "+JSON.stringify(body));
      _bookmarksupport(body, userId, userIP, sToken, function(err,result) {
         console.log("BOOKMARK_EDIT_POST-2 "+err+" "+result);
         //technically, this should return to "/" since Lucene is not ready to display
         // the new post; you have to refresh the page in any case
         return res.redirect("/bookmark");
     });
    });
};
