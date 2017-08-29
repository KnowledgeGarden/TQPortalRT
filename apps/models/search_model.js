/**
 * Created by park on 11/27/2015.
 */
var Constants = require("../constants"),
    SearchModel;

SearchModel =  module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver();

    console.log("Search");

    self.isConversationType = function(type) {
  		var result = false;
  		if (type) {
  			if (type === constants.CONVERSATION_MAP_TYPE ||
  				type === constants.PRO_TYPE ||
  				type === constants.CON_TYPE ||
  				type === constants.POSITION_TYPE ||
  				type === constants.CHALLENGE_TYPE ||
  				type === constants.ISSUE_TYPE ||
  				type === constants.EVIDENCE_TYPE ||
  				type === constants.CLAIM_TYPE ||
  				type === constants.DECISION_TYPE)
  				result = true;
  		}
  		return result;
  	}

    //////////////////////////
    //API
    //////////////////////////

    function buildHits(result, src) {
      for (var i=0; i< src.length; i++) {
        result.push({
          locator: src[i].lox,
          label: src[i].label[0]
        });
      }
    }
    /**
     * Each line of hits should include locator, label
     * Locator must include the object type, e.g. /blog/locator
     * @param query
     * @param user
     * @param language
     * @param start
     * @param count
     * @param callback: signature (err,data)
     */
    self.runSearch = function (query, language, start, count, userId, userIP, sToken, callback) {
      var data = null,
          countsent = 0,
          total = 0,
          sortBy = null,
          sortDir = null;
      console.log("SEARCHING: "+query);
      topicDriver.fullTextQuery(query, start, count, sortBy, sortDir,
        userId, userIP, sToken, function(err, rslt) {
        var hx = rslt.cargo,
            hits = [];
        //console.log("SEARCHING "+hx.length+" | "+JSON.stringify(hx, null, 2));
        if (hx && Array.isArray(hx)) {
          buildHits(hits, hx);
          data = hits;
          console.log("SEARCHGOT "+JSON.stringify(data));
          countsent = hits.length;
        }
        return callback(data, countsent, total);

      })
    };
};
