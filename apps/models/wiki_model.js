/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants"),
    WikiModel;

WikiModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Wiki "+topicDriver);

    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
      console.log("BlogModel.fillDatatable "+userId);
      topicDriver.listInstanceTopics(Constants.WIKI_TYPE, start, count, 
        Constants.SORT_LABEL, Constants.ASC_DIR,
          userId, userIP, sToken, function bmF(err, rslt) {
        console.log("LISTWIKIS "+err+" | "+JSON.stringify(rslt));
        var count = 0,
            d = rslt.cargo;
        if (d) {
          count = d.length;
        }
        return callback(err, rslt, count, 0);
      });
    };

    self.createWikiTopic = function(json, userId, userIP, sToken, callback) {
      console.log("WIKI_MODEL_NEW_TOPIC "+JSON.stringify(json)+" | "+JSON.stringify(userId));

      var pivots = CommonModel.jsonBallToPivots(json),
          lang = json.language;
      if (!lang) { lang = "en";}
      CommonModel.createTopicInstance(null, Constants.WIKI_TYPE, userId,
          json.title, json.body, lang, Constants.PUBLICATION, Constants.PUBLICATION_SM,
          false, null, pivots, userIP, sToken, function umC(err, rslt) {
        return callback(err, rslt);
      });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
      console.log("WIKI_MODEL_UPDATE_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));

      CommonModel.updateTopicTextFields(json, userId, userIP, sToken, function bmU(err, rslt) {
        return callback(err, rslt);
      });
    };
};
