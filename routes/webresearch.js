/**
 * Created by park on 11/26/2015.
 */
var Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment);

    /////////////////
    // Menu
    /////////////////
    environment.addApplicationToMenu("/research","Research");
    /////////////////
    // Routes
    /////////////////
    app.get("/research", helpers.isPrivate, function webResearchGet(req, res) {
        res.render("webresearch", environment.getCoreUIData(req));
    });
}