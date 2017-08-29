/**
 * Created by park on 6/22/2016.
 * an App which supports New connections on topics
 */

var Constants = require("../apps/constants"),
    Cm = require("../apps/models/connection_model"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
  var CommonModel = environment.getCommonModel(),
      ConnectionModel = new Cm(environment);
      helpers = new Help(environment);

  console.log("Relation ");

  /////////////
  // Not a menu app
  /////////////

  /////////////
  // Routes
  /////////////

  /**
   * Fetch a specific relation
   */
  app.get("/relation/:id", helpers.isPrivate, function(req, res) {
      var data = environment.getCoreUIData(req);

      res.render("relation" , data);
  });

  /**
   * <p>Get a new relation form
   * Assumes query of form /relationnew/?src='xxx'&trg='xxx'
   * where "xxx" can be "" or some locator; both cannot be empty</p>
   * <p>The process is this:<br/><ul>
   * <li>First, remember a node to transclude</li>
   * <li>Then navigate to related topic</li>
   * <li>Then select Connections tab</li>
   * <li>Observe the New Connecton table, which has two New buttons</li>
   * <li>If you choose the New button in the Source column, the
   *     remembered Node will be the source, and the topic in view will be
   *     the target node. And vice-versa.</li>
   * <li>Clicking a New button takes you to the RelationForm</li>
   * <li>Use the pulldown menu to select a Relation Type</li>
   * <li>Click Save</li>
   */
  app.get("/relationnew/", helpers.isLoggedIn, function(req, res) {
    var srclocator = req.query.srclocator,
        trglocator = req.query.trglocator,
        remembered = req.session.transclude;
        json = environment.getCoreUIData(req);
    if (!srclocator && !trglocator) {
      req.flash("error", "Both Source and Target cannot be undefined");
      return res.redirect("/");
    }
    if (!remembered) {
      req.flash("error", "Missing remembered topic");
      return res.redirect("/");
    }
    if (!srclocator) {
      srclocator = remembered;
    } else {
      trglocator = remembered;
    }
    if (!trglocator) {
      trglocator = "";
    }
    json.srclocator = srclocator;
    json.trglocator = trglocator;
    return res.render("relation_form", json);
  });

  app.post("/relation/new", helpers.isLoggedIn, function(req, res) {
    var body = req.body,
        userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
        userIP = "",
        sToken = req.session[Constants.SESSION_TOKEN];
    console.log("RELATION_NEW_POST "+JSON.stringify(body));
// {"srclocator":"b921a18c-5677-4ea6-b076-f6f11dec3e9f","trglocator":"d35a60e7-b852-4d3e-a2ec-01db0087f482","select":"HasNothingToDoWithRelationType"}
    ConnectionModel.createConnection(body, userId, userIP, sToken, function rcC(err, rslt) {
      return res.redirect("/"); //TODO
    });
  });

};
