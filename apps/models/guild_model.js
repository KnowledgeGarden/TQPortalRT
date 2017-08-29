/**
 * Created by park on 5/28/2016.
 * TODO
 *    Guild creator is Member, Leader
 *    Other guild members can be a Leader
 *      HOW to represent that?
 *    NEED
 *     DID isGuildLeader()
 *      SEE /routes/guild.js
 */
var Constants = require("../constants"),
    GuildModel;


GuildModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        ConversationModel = environment.getConversationModel(),
        CommonModel = environment.getCommonModel(),
        AdminModel = environment.getAdminModel();
    console.log("GUILD "+topicDriver);

    self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
        console.log("GuildModel.fillDatatable "+userId);
        topicDriver.listInstanceTopics(Constants.GUILD_TYPE, start, count,
            userId, userIP, sToken, function bmF(err, rslt) {
          console.log("LISTGUILDS "+err+" | "+JSON.stringify(rslt));
          return callback(err, rslt, 0, 0);
        });
    };

    /**
     * Create a new Guild topic
     */
    self.create = function(json, userId, userIP, sToken, callback) {
        console.log("GUILD_MODEL_NEW_TOPIC "+JSON.stringify(json)+" | "+userId);
        var pivots = CommonModel.jsonBallToPivots(json),
            lang = json.language;
        if (!lang) { lang = "en";}
        CommonModel.createTopicInstance(null, Constants.GUILD_TYPE, userId,
              json.title, json.body, lang, Constants.GUILD, Constants.GUILD_SM,
              false, null, pivots, userIP, sToken, function umC(err, rslt) {
          return callback(err, rslt);
        });
    };

    self.update = function(json, userId, userIP, sToken, callback) {
        //TODO
    };
    ////////////////////////////////////
    // GUILD MEMBERSHIP
    //  A user can join a guild if it is not private and not already a member
    //  A user can leave a guild
    //  A user can be banned from a build by way of a leader
    //    Banning means appending BANNED to guildId and installing that in
    //    the User's credentials
    //    OR
    //    by keeping a list of banned users in the Guild's topic
    //     but that means we are putting more stuff on the backs of the topics.
    //  WILL consider an RDBMS solution for guilds
    // FOR NOW THESE ARE NOT USED
    // SEE NOTES and code in /routes/guild.js
    ////////////////////////////////////
    /**
     * User joins a guild
     * @param guildId
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback  signature (err)
     */
    self.joinGuild = function(guildId, userId, userIP, sToken, callback) {
      console.log("JOINGUILD "+guildId+" "+userId);
      var err;
      //TODO
      return callback(err);
    };

    /**
     * User leaves a guild
     * @param guildId
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback  signature (err)
     */
    self.leaveGuild = function(guildId, userId, userIP, sToken, callback) {
      console.log("LEAVEGUILD "+guildId+" "+userId);
      var err;
      //TODO
      return callback(err);
    };

    self.addLeader = function(guildId, userId, userIp, sToken, callback) {
      console.log("ADDLEADER "+guildId+" "+userId);
      var err;
      //TODO
      return callback(err);
    };

    self.removeLeader = function(guildId, userId, userIp, sToken, callback) {
      console.log("REMOVELEADER "+guildId+" "+userId);
      var err;
      //TODO
      return callback(err);
    };

};
