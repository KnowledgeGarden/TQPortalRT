/**
 * Created by park on 11/27/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        SearchModel = environment.getSearchModel();

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/srch","Search");
    /////////////
    // Routes
    /////////////

    /**
     * Initial fetch of the /blog landing page
     */
    app.get("/search", helpers.isPrivate, function(req, res) {
        var query = req.query.srch_term,
            start=0,
            language = "en",
            data = environment.getCoreUIData(req),
            count=Constants.MAX_HIT_COUNT, //pagination size
            userId= helpers.getUserId(req),
            userIP= "",
            sToken= null;
            console.log("QUERY "+query);
        SearchModel.runSearch(query, "en", start, count, userId, userIP, sToken,
              function searchRunSearch(rslt, countsent, totalavailable) {
           //TODO
           console.log("QUERY+ "+rslt);
           if (count > 0) {
             data.hits = rslt;
           }
           data.querystring = query;
           return res.render("searchhits" , data);
        });
    });

    app.get("/srch", helpers.isPrivate, function(req, res) {
      var data = environment.getCoreUIData(req);
      return res.render("search", data);
    });
};
