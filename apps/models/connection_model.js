/**
 * Created by park on 11/20/2016.
 */
 var Constants = require("../constants"),
     ConnectionModel;

ConnectionModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("Blog "+topicDriver);

    /////////////////////
    // API
    /////////////////////

    /**
     * <p>Create a new connection among two topics.</p>
     * <p>The process presupposed these objects:<br/>
     * <ul><li> A source topic identifier</li>
     * <li> A target topic identifier</li>
     * <li> A relation topic identifier</li>
     * </ul></p>
     * @param json
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.createConnection = function(json, userId, userIP, sToken, callback) {
      console.log("ConnectionModel.create "+userId+" "+userIP+" "+sToken);
      json.RelTypLoc = json.select;
      json.RelSrcLoc = json.srclocator;
      json.RelTrgLoc = json.trglocator;
      console.log("ConnectionModel.create "+JSON.stringify(json));
      topicDriver.connectTwoTopics(json,
                userId, userIP, sToken, function ccC(err, result) {
        console.log("ConnectionModel.createConnection "+err+" "+result);
        return callback(err, result);
      });
    };
};
