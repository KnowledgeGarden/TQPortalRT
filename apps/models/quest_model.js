/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../constants"),
    QuestModel;

QuestModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("QUEST "+topicDriver);

    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
      console.log("QuestModel.fillDatatable "+userId);
      topicDriver.listInstanceTopics(Constants.QUEST_TYPE, start, count,
          userId, userIP, sToken, function bmF(err, rslt) {
        console.log("LISTQUESTS"+err+" | "+JSON.stringify(rslt));
        return callback(err, rslt, 0, 0);
      });
    };

    /**
     * Create a new Quest Topic
     * Create a Quest Root node
     * NOTE: we can borrow the parent-child mechanism and make QuestRoot a child
     * of the Quest topic, and display the RootNode as a "parent" in the Tree tab
     */
    self.create = function(json, userId, userIP, sToken, callback) {
      console.log("QUEST_MODEL_NEW_TOPIC "+JSON.stringify(json)+" | "+JSON.stringify(userId));

      var pivots = CommonModel.jsonBallToPivots(json),
          lang = json.language,
          url = null,
          nodeType = Constants.CHALLENGE_TYPE; //ISSUE_TYPE;
      if (!lang) { lang = "en";}
      CommonModel.createTopicInstance(null, Constants.QUEST_TYPE, userId,
          json.title, json.body, lang, Constants.QUEST, Constants.QUEST_SM,
          false, url, pivots, userIP, sToken, function umC(err, rsltx) {
        console.log("QT "+JSON.stringify(rsltx));
        console.log("THISISIT "+rsltx.lox);
        CommonModel.createConversationNode(nodeType, rsltx.lox, rsltx.lox,
            userId, json.title, json.body, lang, json.url, //TODO ??? url ???
            "/images/ibis/challenge.png", "/images/ibis/challenge_sm.png", false, null,
            userIP, sToken, function umC(err, rslt) {
              return callback(err, rslt);
            });

      });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
        //TODO
    };
};
