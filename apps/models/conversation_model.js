/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants"),
    ConversationModel;

ConversationModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Conversation "+topicDriver);

    function getSmallIcon(nodeType) {
        var result = Constants.MAP_SM;//default
        if (nodeType === Constants.ISSUE_TYPE) {return Constants.ISSUE_SM;}
        if (nodeType === Constants.POSITION_TYPE) {return Constants.POSITION_SM;}
        if (nodeType === Constants.PRO_TYPE) {return Constants.PRO_SM;}
        if (nodeType === Constants.CON_TYPE) {return Constants.CON_SM;}
        if (nodeType === Constants.NOTE_TYPE) {return Constants.NOTE_SM;}
        if (nodeType === Constants.REFERENCE_TYPE) {return Constants.REFERENCE_SM;}
        return result;
    };

    function getLargeIcon(nodeType) {
        var result = Constants.MAP; //default
        if (nodeType === Constants.ISSUE_TYPE) {return Constants.ISSUE;}
        if (nodeType === Constants.POSITION_TYPE) {return Constants.POSITION;}
        if (nodeType === Constants.PRO_TYPE) {return Constants.PRO;}
        if (nodeType === Constants.CON_TYPE) {return Constants.CON;}
        if (nodeType === Constants.NOTE_TYPE) {return Constants.NOTE;}
        if (nodeType === Constants.REFERENCE_TYPE) {return Constants.REFERENCE;}
        return result;
    };


    /////////////////////////////
    // API
    /////////////////////////////
    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
      console.log("BConversationModel.fillDatatable "+userId);
      topicDriver.listInstanceTopics(Constants.CONVERSATION_MAP_TYPE, start, count,
        Constants.SORT_LABEL, Constants.ASC_DIR,
         userId, userIP, sToken, function bmF(err, rslt) {
        console.log("LISTConversations "+err+" | "+JSON.stringify(rslt));
        var count = 0,
            d = rslt.cargo;
        if (d) {
          count = d.length;
        }
        return callback(err, rslt, count, 0);
      });
    };

    self.create = function(json, isPrivate, userId, userIP, sToken, callback) {
      console.log("CONVERSATION_MODEL_NEW_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));
      var pivots = CommonModel.jsonBallToPivots(json),
          lang = json.language,
          nodeType = json.nodetype;
      if (!lang) { lang = "en";}
      CommonModel.createConversationNode(nodeType, json.parentlocator, json.context,
          userId, json.title, json.body, lang, json.url,
          getLargeIcon(nodeType), getSmallIcon(nodeType), isPrivate, pivots,
          userIP, sToken, function umC(err, rslt) {
        return callback(err, rslt);
      });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
      console.log("CONV_MODEL_UPDATE_POST "+JSON.stringify(json)+" | "+sToken);
      CommonModel.updateTopicTextFields(json, userId, userIP, sToken, function bmU(err, rslt) {
        return callback(err, rslt);
      });
    };

    self.transclude = function(json, isEvidence,
          userId, userIP, sToken, callback) {
      var parent = json.locator,
          child = json.transcludelocator,
          context = json.contextLocator,
          language = json.language;
      topicDriver.transclude(parent, child, context, language, userId, userIP,
          sToken, function cmT(err, rslt) {
        return callback(err, rslt);
      });
    };


};
