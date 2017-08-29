/**
 * Created by park on 11/17/2015.
 */

var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
    TagModel = environment.getTagModel();
    console.log("Landing "+environment.getIsPrivatePortal());
    /////////////
    // Routes
    /////////////

    /**
     * Essentially, getOrCreate called by ajax
     * If available, returns json
     * Otherwise, opens an edit form
     */
    app.get("/", helpers.isPrivate, function(req, res) {
        var data = environment.getCoreUIData(req);
        data.title = "TQPortalKS";
        //return res.render('index',  data);
        //Get HelpTag topic
        var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
            userIP = "",
            theUser = helpers.getUser(req),
            sToken = req.session[Constants.SESSION_TOKEN];
        TagModel.listDocumentsForHelpTopicTag(data, userId, userIP, sToken, function bFT() {
          //TODO?
          return res.render("newlanding", data);
        });
    });

    app.post("/landing", helpers.isPrivate, function(req, res) {
        //TODO ???
    });
};
