/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var CommonModel = environment.getCommonModel(),
        helpers = new Help(environment),
        QuestModel = environment.getQuestModel();

    console.log("Quest "+QuestModel);

    // a Quest does not show on the Menu
    /////////////
    // Routes
    /////////////

    app.get("/quest/:id", helpers.isPrivate, function(req, res) {
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
                var lox = rslt.cargo.lox;
                    data = CommonModel.populateTopic(rslt.cargo, theUser, data);
                CommonModel.populateQuestTree(lox, lox, userId, userIP, sToken, function qPT(err, tree) {
                  data.myTree = tree;
                  console.log("CANJOIN "+q+" "+canJoin);
                  return res.render("quest", data);
                });
              } else {
                req.flash("error", "Cannot get "+q);
                res.redirect("/");
              }
          });
      } else {
          //That's not good!
          //TODO  alert stuff
          console.log("DANG "+q);
          req.flash("error", "Cannot get "+q);
          res.redirect("/");
      }
    });

    app.get("/questnew", helpers.isLoggedIn, function (req, res) {
        var data = environment.getCoreUIData(req);
        data.formtitle = "New Quest";
        data.isNotEdit = true;
        data.action = "/quest/new";
        return res.render("blogwikiform", data);
    });

    var _questsupport = function (body, userId, userIP, sToken, callback) {
        if (body.locator === "") {
            QuestModel.create(body, userId, userIP, sToken, function (err, result) {
                return callback(err, result);
            });
        } else {
            QuestModel.update(body, userId, userIP, sToken, function (err, result) {
                return callback(err, result);
            });
        }
    };

    app.post("/quest/new", helpers.isLoggedIn, function (req, res) {
      var body = req.body,
          userId = helpers.getUserId(req),
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("QUEST_NEW_POST " + JSON.stringify(body));
      _questsupport(body, userId, userIP, sToken, function (err, result) {
          console.log("QUEST_NEW_POST-1 " + err + " " + result);
          return res.redirect("/rpg");
      });
    });

};
