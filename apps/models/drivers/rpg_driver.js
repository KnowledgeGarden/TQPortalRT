/**
 * Created by park on 11/25/2016.
 */
var Qu = require('./query_util'),
    Constants = require('../../constants'),
    RPGDriver;

RPGDriver =  module.exports = function(environment) {
    var self = this,
        httpClient = environment.getHttpClient(),
        queryUtil = new Qu();
    console.log("TopicDriver "+httpClient);


    self.addLeaderToGuild = function(guildLocator, leaderId, language, userId,
                                userIP, sToken, callback) {
        var urx = '/rpg/',
            verb = Constants.ADD_LEADER,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.gLoc = guildLocator;
        query.mId = leaderId;
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.removeLeaderFromGuild = function(guildLocator, leaderId, language, userId,
                                userIP, sToken, callback) {
        var urx = '/rpg/',
            verb = Constants.REMOVE_LEADER,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.gLoc = guildLocator;
        query.mId = leaderId;
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.addMemberToGuild = function(guildLocator, memberId, language, userId,
                                userIP, sToken, callback) {
        var urx = '/rpg/',
            verb = Constants.ADD_MEMBER,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.gLoc = guildLocator;
        query.mId = memberId;
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.removeMemberFromGuild = function(guildLocator, memberId, language, userId,
                                userIP, sToken, callback) {
        var urx = '/rpg/',
            verb = Constants.REMOVE_MEMBER,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.gLoc = guildLocator;
        query.mId = memberId;
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };

};
