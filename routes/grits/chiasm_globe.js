/**
 * Created by park on 11/29/2015.
 */
var Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment);

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/globe","Globe");
    /////////////
    // Routes
    /////////////

    app.get("/globe", helpers.isPrivate, function(req, res) {
        var data = environment.getCoreUIData(req);

        res.render("globe" , data);
    });

};
