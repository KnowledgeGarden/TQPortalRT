/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants"),
    BlogModel;

BlogModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Blog "+topicDriver);

    /////////////////////
    // API
    /////////////////////


    /**
     *
     * @param start
     * @param count
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback signature (err, json, countSent, countTotal)
     */
    self.fillDatatable = function(start, count,
          userId, userIP, sToken, callback) {
      console.log("BlogModel.fillDatatable "+userId);
      //TODO we need to sort posts on date, descending
      topicDriver.listInstanceTopics(Constants.BLOG_TYPE, start, count,
        Constants.SORT_DATE, Constants.DSC_DIR, userId,
      //topicDriver.listInstanceTopics(Constants.BLOG_TYPE, start, count, userId,
          userIP, sToken, function bmF(err, rslt) {
        console.log("LISTBLOGS "+err+" | "+JSON.stringify(rslt));
        var count = 0,
            d = rslt.cargo;
        if (d) {
          count = d.length;
        }
        return callback(err, rslt, count, 0);
      });
      //LISTBLOGS undefined | {"rMsg":"ok","rToken":"","cargo":[{"crDt":"2015-12-27T14:50:24-08:00",
      // "trCl":["TypeType","ClassType","NodeType","BlogNodeType"],"lox":"8ff7356a-f35a-45d9-9660-fe04787a6de5",
      // "sIco":"/images/publication_sm.png","isPrv":false,"_ver":"1451256624788","lEdDt":"2015-12-27T14:50:24-08:00",
      // "details":["In which I shall say nothing!"],"lIco":"/images/publication.png","inOf":"BlogNodeType"},
      // {"crDt":"2015-12-27T14:53:32-08:00","trCl":["TypeType","ClassType","NodeType","BlogNodeType"],
      // "lox":"54b53c75-ffcc-47b2-9a19-75abcc6cc710","sIco":"/images/publication_sm.png","isPrv":false,
      // "_ver":"1451256812114","lEdDt":"2015-12-27T14:53:32-08:00","details":["Yup!"],
      // "lIco":"/images/publication.png","inOf":"BlogNodeType"}]}
    };

    self.createBlogPost = function(json, userId, userIP, sToken, callback) {
      console.log("BLOG_MODEL_NEW_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));
      //BLOG_MODEL_NEW_POST {"locator":"","title":"My First Official Blog Post","body":"
      //Yup","tag1":"","tag2":"","tag3":"","tag4":""} | "jackpark"
      //locator, typeLocator, userId, label,
      //details, language, largeImagePath, smallImagePath,
      //    isPrivate, jsonPivots, userIP,sToken,
      var pivots = CommonModel.jsonBallToPivots(json),
          lang = json.language;
      if (!lang) { lang = "en";}
      CommonModel.createTopicInstance(null, Constants.BLOG_TYPE, userId,
          json.title, json.body, lang, Constants.PUBLICATION, Constants.PUBLICATION_SM,
          false, null, pivots, userIP, sToken, function bmC(err, rslt) {
        return callback(err, rslt);
      });
    };

//////////////////////////
// Updating a topic is somewhat complex:
//  We are possibly updating a label or a details field.
//  Some topics may have many labels; issue becomes which one
//  Some topics may have many detais; issue becomes which one
//  Overriding issue is *language*
//  What we get here is a simple set of updated fields (label and details)
//  We are forced to fetch the topic and perform surgery, then send the full
//  Topic back to BacksideServlet.
//  A simple way forward is to add a feature to BacksideServlet which simply
//  tells it to updateTextFields
/////////////////////////
    self.update = function(json, userId, userIP, sToken, callback) {
      console.log("BLOG_MODEL_UPDATE_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));

      CommonModel.updateTopicTextFields(json, userId, userIP, sToken, function bmU(err, rslt) {
        return callback(err, rslt);
      });
    };
};
