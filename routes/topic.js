/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var CommonModel = environment.getCommonModel(),
        helpers = new Help(environment);


    console.log("Topic ");

    // a Guild does not show on the Menu
    /////////////
    // Routes
    /////////////

    app.get("/topic/:id", helpers.isPrivate, function(req, res) {
      var q = req.params.id,
          contextLocator = req.query.contextLocator;
      if (!contextLocator) {
        contextLocator = q;
      }
      console.log("GETTOPIC "+q);
      if (q) {
          var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
              theUser = helpers.getUser(req),
              userIP = "",
              sToken = req.session[Constants.SESSION_TOKEN];

          CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                CommonModel.populateConversationTopic(rslt.cargo, contextLocator, theUser, "/topic/", userIP, sToken,
                            data, function bC(err, rslt) {
                    data = rslt;
                    //console.log("BOOBOOBOO "+JSON.stringify(data));
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
                    //console.log("CANEDIT "+userId+" | "+data.userid+" | "+data.isAdmin);
                    if (helpers.isLoggedIn) {
                      if (userId === data.userid || data.isAdmin) {
                        canEdit = true;
                      }
                    }
                    data.canEdit = canEdit;
                    data.editurl = "/topicedit/"+q;

                    return res.render("ctopic", data);
                });
              } else {
                req.flash("error", "Cannot get "+q);
                res.redirect("/");
              }
          });
      } else {
          //That's not good!
          //TODO
      }
    });

    app.get("/topicedit/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id,
          contextLocator = req.query.contextLocator,
          language = "en"; //TODO we need to deal with language
      console.log("TopicEdit "+q+" "+contextLocator);
      if (q) {
          var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
              theUser = helpers.getUser(req),
              userIP = "",
              sToken = req.session[Constants.SESSION_TOKEN];
          CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
              var data =  environment.getCoreUIData(req);
              if (rslt.cargo) {
                console.log("CARGO "+JSON.stringify(rslt.cargo));
                data.action = "/topic/edit";
                data.formtitle = "Edit Topic";
                data.locator = q; // this makes the form know it's for editing
                data.title = "Title editing is disabled"; //rslt.cargo.label;
                data.language = language;
                data.body = rslt.cargo.details;
                //TODO  maybe not
                return res.render("blogwikiform", data);
              }
          });
        } else {
            //That's not good!
            req.flash("error", "Cannot get "+q);
            res.redirect("/");
        }
    });
    app.post("/topic/edit", helpers.isLoggedIn, function(req, res) {
      var body = req.body,
          userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("TopicEditPost "+JSON.stringify(body));
      CommonModel.updateTopicTextFields(body, userId, userIP, sToken, function bmU(err, rslt) {
         console.log("TOPIC_EDIT_POST-2 "+err+" "+rslt);
         return res.redirect("/"); //TODO we don't know where to return
     });
   });

  };
