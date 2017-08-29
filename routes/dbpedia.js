/**
 * Created by park on 11/26/2015.
 */
var Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment);
    /////////////////
    // Menu
    /////////////////
    environment.addApplicationToMenu("/dbpedia","DbPedia");

    /////////////////
    // router
    /////////////////
    app.get("/dbpedia", helpers.isPrivate, function dbPediaGet(req, res) {
        var data = environment.getCoreUIData(req);
        return res.render("dbpedia", data);
    });

};