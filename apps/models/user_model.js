/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants"),
    UserModel;

UserModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        CommonModel = environment.getCommonModel();
    console.log("User "+topicDriver);

    self.listUsers = function(start, count, callback) {
      topicDriver.listUserTopics(start, count, Constants.SYSTEM_USER,
          "", "", function umLU(err, rslt) {
        console.log("UserModel.listUsers "+err+" "+JSON.stringify(rslt));
        return callback(err, rslt);
      });
//////////////////////////
// UserModel.listUsers undefined {"rMsg":"ok","rToken":"","cargo":[{"crDt":"2015-11-24T13:14:17-08:00",
// "trCl":["TypeType","UserType"],"crtr":"SystemUser","lox":"sam","sIco":"/images/person_sm.png",
// "isPrv":false,"_ver":"1448399657644","lEdDt":"2015-11-24T13:14:17-08:00",
// "details":[""],"label":["Sam Slow"],"lIco":"/images/person.png","inOf":"UserType"}]}
//////////////////////////
    };

    self.getUser = function(locator, callback) {
      console.log("UserModel.getUser "+locator);
      topicDriver.grabTopic(locator, Constants.SYSTEM_USER, "", "", function umGU(err, rslt) {
        console.log("UserModel.getUser "+err+" "+JSON.stringify(rslt));
//////////////////////////
//UserModel.getUser undefined {"rMsg":"ok","rToken":"","cargo":{"crDt":"2015-11-24T13:14:17-08:00",
// "trCl":["TypeType","UserType"],"crtr":"SystemUser","lox":"sam","sIco":"/images/person_sm.png",
// "isPrv":false,"_ver":"1448399657644","lEdDt":"2015-11-24T13:14:17-08:00","details":[""],
// "label":["Sam Slow"],"lIco":"/images/person.png","inOf":"UserType"}}
//////////////////////////
        return callback(err, rslt);
      });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
      console.log("USER_MODEL_UPDATE "+JSON.stringify(json)+" | "+JSON.stringify(userId));

      CommonModel.updateTopicTextFields(json, userId, userIP, sToken, function bmU(err, rslt) {
        return callback(err, rslt);
      });
    };

};
