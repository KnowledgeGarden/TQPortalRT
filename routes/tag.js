/**
 * Created by park on 12/29/2015.
 */
var Constants = require("../apps/constants"),
    Help = require("./helpers/helpers");

exports.plugin = function(app, environment) {
    var helpers = new Help(environment),
        TagModel = environment.getTagModel(),
        CommonModel = environment.getCommonModel();

    /////////////
    // Menu
    /////////////
    environment.addApplicationToMenu("/tag","Tags");
    /////////////
    // Routes
    /////////////

    app.get("/tag", helpers.isPrivate, function(req, res) {
        var start = helpers.validateNumber(parseInt(req.query.start)),
            count = helpers.validateCount(parseInt(req.query.count));
        if (!start) {
            start = 0;
        }
        if (!count) {
            count = Constants.MAX_HIT_COUNT;
        }
        console.log("TAGS "+start+" "+count);

        var userId= helpers.getUserId(req),
            userIP= "",
            sToken= null,
            usx = helpers.getUser(req),
            credentials = usx.uRole;

        TagModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
            console.log("Tag.index "+data);
            var cursor = start+countsent,
                json = environment.getCoreUIData(req);
            //pagination is based on start and count
            //both values are maintained in an html div
            json.start = cursor;
            json.count = Constants.MAX_HIT_COUNT; //pagination size
            json.total = totalavailable;
            json.cargo = data.cargo;
            json.ret = 0;
            return res.render("tagindex", json);
        });
    });

    app.get("/tagnext/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("TagNext: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      TagModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Tag.index "+countsent+" "+data);
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
          return res.render("tagindex", json);
      });
    });
    app.get("/tagprev/:id", helpers.isPrivate, function(req, res) {
      var start = parseInt(req.params.id),
          count = Constants.MAX_HIT_COUNT;
      console.log("TagPrev: "+start);
      //OK: we get here. "start" sets the cursor.
      var userId= helpers.getUserId(req),
          userIP= "",
          sToken= null,
          usx = helpers.getUser(req),
          credentials = usx.uRole;
      TagModel.fillDatatable(start, count, userId, userIP, sToken, function blogFill(err, data, countsent, totalavailable) {
          console.log("Tag.index "+countsent+" "+data);

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
          return res.render("tagindex", json);
      });
    });

    app.get("/tag/:id", helpers.isPrivate, function(req, res) {
        var q = req.params.id;
        console.log("GETTAG "+q);
        if (q) {
            var userId = helpers.getUserId(req), //req.session[Constants.USER_ID],
                userIP = "",
                theUser = helpers.getUser(req),
                sToken = req.session[Constants.SESSION_TOKEN];
            CommonModel.fetchTopic(q, userId, userIP, sToken, function bFT(err, rslt) {
                var data =  environment.getCoreUIData(req);
                if (rslt.cargo) {
                    data = CommonModel.populateTopic(rslt.cargo, theUser, data);
                }
                return res.render("topic", data);
            });
        } else {
            //That's not good!
            req.flash("error", "Cannot get "+q);
            res.redirect("/");
        }
    });

    app.get("/tagnew/:id", helpers.isLoggedIn, function(req, res) {
      var q = req.params.id,
          data =  environment.getCoreUIData(req);
      console.log("TAGNEW "+q);
      data.locator = q;
      data.language = "en"; //TODO
      return res.render("add_tags_form", data);
    });

    app.post("/tag/new", helpers.isLoggedIn, function(req, res) {
      var body = req.body,
          userId = helpers.getUserId(req),
          userIP = "",
          sToken = req.session[Constants.SESSION_TOKEN];
      console.log("TAG_NEW_POST "+JSON.stringify(body));
//{"locator":"1eaa8fe2-4f48-4210-be86-f6d99e90ed2b","tag1":"Tag A","tag2":"Tag B","tag3":"","tag4":""}
      TagModel.addTags(body, userId, userIP, sToken, function tpN(err, rslt) {
        return res.redirect("/topic/"+body.locator);
      });
    });
};
