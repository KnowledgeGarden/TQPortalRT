/**
 * Created by park on 11/17/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var BlogModel = environment.getBlogModel(),
        CommonModel = environment.getCommonModel(),
        helpers = new Help(environment);

    console.log("Blog "+BlogModel);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/blog","Blog");
    /////////////
    // Routes
    /////////////

    /**
     * GET blog index
     */
    app.get("/blog", helpers.isPrivate, function(req, res) {
        var start = helpers.validateNumber(parseInt(req.query.start)),
            count = helpers.validateCount(parseInt(req.query.count));
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("BLOGS "+start+" "+count);

        var userId= helpers.getUserId(req),
            userIP= "",
            sToken= null,
            usx = helpers.getUser(req),
            credentials = usx.uRole;

        BlogModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Blog.index "+countsent+" "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            return res.render("blogindex", json);
        });
    });

    app.get("/blognext/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("BlogNext: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      BlogModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Blog.index "+countsent+" "+data);
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
          return res.render("blogindex", json);
      });
    });
    app.get("/blogprev/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("BlogPrev: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      BlogModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Blog.index "+countsent+" "+data);

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
          return res.render("blogindex", json);
      });
    });

    app.get("/blog/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id,
            contextLocator = req.query.contextLocator;
        if (!contextLocator) {
          contextLocator = q;
        }

        console.log("GETBLOG "+q+" "+contextLocator);
        if (q) {
            var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
                theUser = helpers.getUser(req),
                userIP = "",
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req),
                    out;
                console.log("FFFFFF "+rslt.cargo);
                if (rslt.cargo) {
                    CommonModel.populateConversationTopic(rslt.cargo, contextLocator, theUser, "/blog/", userIP, sToken,
                                data, function bC(err, rslt) {
                        data = rslt;
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
                        data.editurl = "/blogedit/"+q;
                        console.log("BOABOA "+data.myTree);

                        return res.render("ctopic", data);
/** for dev
{"isAuthenticated":true,"isAdmin":false,"email":"joe@sixpack.com",
"appmenu":[{"url":"/rpg","name":"Quests"},{"url":"/blog","name":"Blog"},{"url":"/bookmark","name":"Bookmark"},{"url":"/globe","name":"Globe"},{"url":"/conversation","name":"Conversation"},{"url":"/dbpedia","name":"DbPedia"},{"url":"/geomap","name":"GeoMap"},{"url":"/relation","name":"Relations"},{"url":"/search","name":"Search"},{"url":"/tag","name":"Tags"},{"url":"/user","name":"User"},{"url":"/research","name":"Research"},{"url":"/wiki","name":"Wiki"}],
"flashMsg":[],"lIco":"/images/publication.png","label":["Second Post"],"details":["Something to tell"],
"source":"{\"crtr\":\"joe\",\"pvL\":[{\"relationType\":\"DocumentCreatorRelationType\",\"documentLocator\":\"joe\",\"relationLocator\":\"1eaa8fe2-4f48-4210-be86-f6d99e90ed2bDocumentCreatorRelationTypejoe\",\"documentLabel\":\"Joe Sixpack\",\"documentType\":\"UserType\",\"relationLabel\":\"DocumentCreatorRelationType\",\"documentSmallIcon\":\"/images/person_sm.png\"},{\"relationType\":\"TagBookmarkRelationType\",\"documentLocator\":\"blog_post_TAG\",\"relationLocator\":\"blog_post_TAGTagBookmarkRelationType1eaa8fe2-4f48-4210-be86-f6d99e90ed2b\",\"documentLabel\":\"Blog Post\",\"documentType\":\"TagNodeType\",\"relationLabel\":\"TagBookmarkRelationType\",\"documentSmallIcon\":\"/images/tag_sm.png\"}],\"_ver\":\"1479087154916\",\"lEdDt\":\"2016-11-13T17:32:34-08:00\",\"label\":[\"Second Post\"],\"inOf\":\"BlogNodeType\",\"crDt\":\"2016-11-13T17:32:34-08:00\",\"trCl\":[\"TypeType\",\"ClassType\",\"NodeType\",\"BlogNodeType\"],\"lox\":\"1eaa8fe2-4f48-4210-be86-f6d99e90ed2b\",\"sIco\":\"/images/publication_sm.png\",\"isPrv\":false,\"details\":[\"Something to tell\"],\"lIco\":\"/images/publication.png\"}","url":"","userid":"joe","username":"joe","date":"2016-11-13T17:32:34-08:00","showTags":true,"tags":[{"lox":"blog_post_TAG","sIco":"/images/tag_sm.png","label":"Blog Post"}],"showUsers":true,"users":[{"lox":"joe","sIco":"/images/person_sm.png","label":"Joe Sixpack"}]}
*/
                    });
                } else {
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
    /**
     * GET new blog post form
     */
    app.get("/blognew", helpers.isLoggedIn, function(req, res) {
        var data =  environment.getCoreUIData(req);
        data.formtitle = "New Blog Post";
        data.isNotEdit = true;
        data.action = "/blog/new";
        return res.render("blogwikiform", data); //,
    });

    app.get("/blogedit/:id", helpers.isLoggedIn, function(req, res) {
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
                data.action = "/blog/edit";
                data.formtitle = "Edit Blog Post";
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
            return res.redirect("/");
        }
    });

    /**
     * Function which ties the app-embedded route back to here
     */
    var _blogsupport = function(body, userId, userIP, sToken,  callback) {
        if (body.locator === "") {
            BlogModel.createBlogPost(body, userId, userIP, sToken, function blsA(err, result) {
                return callback(err, result);
            });
        } else {
            BlogModel.update(body, userId, userIP, sToken, function blSB(err, result) {
                return callback(err, result);
            });
        }
    };

    /**
     * POST new blog post
     */
    app.post("/blog/new", helpers.isLoggedIn, function(req, res) {
        var body = req.body,
            userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
            userIP = "",
            sToken = req.session[Constants.SESSION_TOKEN];
        console.log("BLOG_NEW_POST "+JSON.stringify(body));
         _blogsupport(body, userId, userIP, sToken, function(err,result) {
            console.log("BLOG_NEW_POST-1 "+err+" "+result);
            //technically, this should return to "/" since Lucene is not ready to display
            // the new post; you have to refresh the page in any case
            return res.redirect("/blog");
        });
    });

    app.post("/blog/edit", helpers.isLoggedIn, function(req, res) {
      var body = req.body,
          userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("BlogEditPost "+JSON.stringify(body));
      _blogsupport(body, userId, userIP, sToken, function(err,result) {
         console.log("BLOG_EDIT_POST-2 "+err+" "+result);
         //technically, this should return to "/" since Lucene is not ready to display
         // the new post; you have to refresh the page in any case
         return res.redirect("/blog");
      });
    });
};
