/**
 * Created by park on 12/31/2015.
 */
var Constants = require("../constants"),
    BookmarkModel;

BookmarkModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Tag "+topicDriver);

    /////////////////////////////
    // API
    /////////////////////////////
    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
      console.log("BookmarkModel.fillDatatable "+userId);
      topicDriver.listInstanceTopics(Constants.BOOKMARK_NODE_TYPE, start, count,
          Constants.SORT_LABEL, Constants.ASC_DIR,
          userId, userIP, sToken, function bmF(err, rslt) {
        console.log("LISTbookmarks "+err+" | "+JSON.stringify(rslt));
        var count = 0,
            d = rslt.cargo;
        if (d) {
          count = d.length;
        }
        return callback(err, rslt, count, 0);
      });
    };

    /**
     * <p>Create a bookmark (topic) for a given URL if it does not already exist.</p>
     * <p>Process any tags if they are supplied</p>
     * @param json
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.createBookmark = function(json, userId, userIP, sToken, callback) {
      console.log("BOOKMARK_MODEL_NEW_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));
      //BLOG_MODEL_NEW_POST {"locator":"","title":"My First Official Blog Post","body":"
      //Yup","tag1":"","tag2":"","tag3":"","tag4":""} | "jackpark"
      //locator, typeLocator, userId, label,
      //details, language, largeImagePath, smallImagePath,
      //    isPrivate, jsonPivots, userIP,sToken,
      var pivots = CommonModel.jsonBallToPivots(json),
          lang = json.language;
      if (!lang) { lang = "en";}
      topicDriver.findOrCreateBookmark(json.url, json.title, json.body, lang,
          pivots, userId, userIP, sToken, function bmC(err, rslt) {
        return callback(err, rslt);
      });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
      console.log("BOOKMARK_MODEL_UPDATE_POST "+JSON.stringify(json)+" | "+JSON.stringify(userId));

      CommonModel.updateTopicTextFields(json, userId, userIP, sToken, function bmU(err, rslt) {
        return callback(err, rslt);
      });
    };
};
/**
 BOOKMARK_MODEL_NEW_POST {"locator":"","url":"https://www.oreilly.com/ideas/manag
ed-data-lake-is-not-a-contradiction-in-terms?imm_mid=0dfe1f&cmp=em-data-na-na-ne
wsltr_20160203","title":"“Managed data lake” is not a contradiction in terms - O
'Reilly Media","body":"When companies have many different sources of data, and m
aybe even multiple instances of Hadoop and other analytics solutions, it’s easy
to lose track of basic information, i.e., metadata. Metadata, or “data about dat
a,” describes data from a technical, operational, or business standpoint. Techni
cal metadata defines the structure and form of the data. Operational metadata tr
acks where the data came from, who loaded it, and how it has moved from raw data
 to transformed data sets. Business metadata is the information users need to fi
nd data for analysis. Without metadata, companies don’t know what data they have
, and they can’t trust the data’s quality—making it impossible to implement data
 governance, and difficult to derive business value from the data.","tag1":"Data
 Lake","tag2":"Big Data","tag3":"","tag4":""} | "sara"
 */
