/**
 * Created by park on 11/16/2015.
 */
var Qu = require('./query_util'),
    Constants = require('../../constants'),
    TopicDriver;

TopicDriver =  module.exports = function(environment) {
    var self = this,
        httpClient = environment.getHttpClient(),
        queryUtil = new Qu();
    console.log("TopicDriver "+httpClient);

    //////////////////////////////
    //API
    //////////////////////////////

    /**
     * Fetch a topic identified by <code>locator</code>
     * @param locator
     * @param userId
     * @param userIP
     * @param sToken can be <code>null</code>
     * @param callback signature (err, rslt)
     */
    self.grabTopic = function(locator, userId, userIP, sToken, callback) {
        console.log("xGRABBING- "+locator);
        var urx = '/tm/',
            verb = Constants.GET_TOPIC,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.lox = locator;
        httpClient.get(urx, query, function tdLUT(err, rslt) {
          //NOTE returns { cargo: <thenode>}
            return callback(err, rslt);
        });
    };

    self.getTopicByURL = function(url, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.GET_TOPIC_BY_URL,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.url = url;
        console.log("GETBYURL "+JSON.stringify(query));
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    /**
     * <p>If a bookmark node exists for the given <code>url</code>, return it.
     * Otherwise, create a new bookmark node and return it.</p>
     * <p>If <code>tagLabelArray</code> is not <code>null</code>, process those
     * tags</p>
     * @param url
     * @param title
     * @param details cannot be <code>null</code>
     * @param language
     * @param tagLabelArray  can be empty array or null
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.findOrCreateBookmark = function(url, title, details, language, tagLabelArray,
                                   userId, userIP, sToken, callback) {
        console.log("FOCB "+url+" | "+title+" | "+language+" | "+tagLabelArray+
            " | "+userId+" | "+userIP+" | "+sToken);
        var urx = '/tm/',
            verb = Constants.FIND_OR_CREATE_BOOKMARK,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.url = url;
        query.label = title;
        query.details = details;
        query.Lang = language;
        if (tagLabelArray !== null)
            query.ListProperty = tagLabelArray;
        httpClient.post(urx, query, function tdFCB(err, rslt) {
            return callback(err, rslt);
        });
   };

    /**
     * Does not really return anything except a success message unless errors
     * @param topicLocator -- the topic node for which tags are related
     * @param tagLabelArray -- a list of tagLabel strings
     * @param language
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.findOrProcessTags = function(topicLocator, tagLabelArray, language, userId,
                                userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.FIND_OR_PROCESS_TAG,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.lox = topicLocator;
        query.ListProperty = tagLabelArray;
        query.Lang = language;
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.transclude = function(parentLocator, childLocator, contextLocator,
                               language, userId, userIP, sToken, callback) {
     var urx = '/tm/',
         verb = Constants.TRANSCLUDE,
         query = queryUtil.getCoreQuery(verb, userId, userIP, sToken),
         cargo = {};
     cargo.parent = parentLocator;
     cargo.child = childLocator;
     cargo.context = contextLocator;
     cargo.Lang = language;
     query.cargo = cargo;
     console.log("TRANSCLUDE "+JSON.stringify(query));
     httpClient.post(urx, query, function tdSNIT(err, rslt) {
         return callback(err, rslt);
     });
    };

    self.listUserTopics = function(start, count, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.LIST_USERS,

            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.localVerb = "ListUsers";
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    /** we use listInstanceTopics
    self.listAllBlogPosts = function(start, count, userId, userIP, sToken, callback) {
      var urx = '/tm/',
          verb = Constants.LIST_ALL_BLOG_POSTS,
          query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
      query.from = start.toString();
      query.count = count.toString();
      httpClient.get(urx, query, function tdLab(err, rslt) {
          return callback(err, rslt);
      });
    };
    */
//    self.listBlogPostsByUser = function(start, count, userId, userIP, sToken, callback) {
      //TODO
//    };

    self.listInstanceTopics = function(typeLocator, start, count, sortBy, sortDir,
                    userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.LIST_INSTANCE_TOPICS,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = typeLocator;
        query.sortBy = sortBy;
        query.sortDir = sortDir;
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.listSubclassTopics = function(superClassLocator, start, count, userId, userIP, sToken) {
      var urx = '/tm/',
          verb = Constants.LIST_SUBCLASS_TOPICS,
          query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
      query.from = start.toString();
      query.count = count.toString();
      query.inOf = typeLocator;
      httpClient.get(urx, query, function tdLUT(err, rslt) {
          return callback(err, rslt);
      });
    };

    /**
     * Given a conversation <code>rootNodeLocator</code>, fetch all the
     * child nodes of this root node, (NOT recursive). Returned as a
     * JSON map {locator1:node,locator1:node...}, where <code>locator</code> is
     * <code>rootNodeLocator</code>
     * @param rootNodeLocator
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     * NOTE: does not appear we use this API anywhere
     */
    self.listTreeChildNodesJSON = function(rootNodeLocator, contextLocator,
          userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.LIST_TREE_CHILD_NODES,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.lox = locator;
        query.ContextLocator = contextLocator;
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };

    /**
     * Collects a JSONObject starting from the proxy identified by
     * <code>rootLocator</code>, which has this structure:<br/>
     * { root: <the entire proxy itself>, kids: [ struct, struct, ...]}
     * where <em>struct</em> is the same structure.
     * @param rootLocator
     * @param contextLocator -- if <code>null</code> returns all child nodes
     * @param userId
     * @param userIP
     * @param sToken
     * @param callback
     */
    self.collectParentChildTree = function(rootLocator, contextLocator,
          userId, userIP, sToken, callback) {
      var urx = '/tm/',
          verb = Constants.COLLECT_CONVERSATION_TREE,
          query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
      query.lox = rootLocator;
      query.ContextLocator = contextLocator;
      console.log("COLLECTINGXXX "+JSON.stringify(query));
      httpClient.get(urx, query, function tdLUT(err, rslt) {
        //console.log("COLLECTING+ "+err+" "+rslt);
        return callback(err, rslt);
      });
    };

    self.connectTwoTopics = function(jsonCargo, userId, userIP, sToken, callback) {
      console.log("ConnectTwoTopics "+JSON.stringify(jsonCargo)+" "+userId+" "+userIP+" "+sToken);
      var urx = '/tm/',
          verb = Constants.ADD_RELATION,
          query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
      query.cargo = jsonCargo;
      console.log("ConnectTwoTopics+ "+JSON.stringify(query));
      httpClient.post(urx, query, function tdSNIT(err, rslt) {
          return callback(err, rslt);
      });
    };


    self.submitNewInstanceTopic = function(jsonTopic, userId, userIP, sToken, callback) {
        console.log("SubmitNewInstanceTopic "+JSON.stringify(jsonTopic)+" "+userId+" "+userIP+" "+sToken);
//SubmitNewInstanceTopic [object Object] undefined [object Object] caccec2d-ff37-4f13-a622-d4a119f08467
        var urx = '/tm/',
            verb = Constants.NEW_INSTANCE_TOPIC,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonTopic;
        console.log("SubmitNewInstanceTopic+ "+JSON.stringify(query));
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };
/* not ready to use this
    self.submitNewSubclassTopic = function(jsonTopic, userId, userIP, sToken, callback) {
        console.log("SubmitNewSubclassTopic "+jsonTopic+" "+userId+" "+userIP+" "+sToken);
        var urx = '/tm/',
            verb = Constants.NEW_SUBCLASS_TOPIC,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonTopic;
        console.log("SubmitNewSubclassTopic+ "+JSON.stringify(query));
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };
*/
    /**
     * Ask Backside to create a new ConversationMapNode
     * @param jsonCargo must conform to cargo requirement of backside servlet
     * @param userId
     * @param userIP,
     * @param sToken,
     * @param callback -- will return the created node
     */
    self.submitNewConversationNode = function(jsonCargo, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.NEW_CONVERSATION_NODE,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonCargo;
        console.log("NewConversationNode+ "+JSON.stringify(query));
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };

    /**
     * Update a full topic
     */
    self.updateTopic = function(jsonCargo, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.UPDATE_TOPIC,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonCargo;
        console.log("UpdateTopic+ "+JSON.stringify(query));
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };

    self.updateTopicTextFields = function(jsonCargo, userId, userIP, sToken, callback) {
        var urx = '/tm/',
            verb = Constants.UPDATE_TOPIC_TEXT_FIELDS,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.cargo = jsonCargo;
        console.log("UpdateTopicTextFields+ "+JSON.stringify(query));
        httpClient.post(urx, query, function tdSNIT(err, rslt) {
            return callback(err, rslt);
        });
    };
    ///////////////////////////////////////////////
    // Below, we have app-specific index fetches
    // We use the concept of "localVerb" because the generalized
    // BacksideServlet is LIST_INSTANCE_TOPICS,  and that's not specific
    // enough for the function "checkVerb" defined above.
    // The process is first: remove the list object from Topics, then
    // later insert it back after the fetch, ready for the client to paint
    ////////////////////////////////////////////////
/*    self.listBookmarkTopics = function(start, count, userId, userIP, sToken) {
        console.log("ServerListBookmarkTopics-");
        console.log("ServerListBookmarkTopics-1");
        var urx = '/tm/',
            verb = Constants.LIST_INSTANCE_TOPICS,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = 'BookmarkNodeType';
        query.localVerb = "ListBookmarks";
        console.log("ServerListBookmarkTopics "+JSON.stringify(query));
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    }; */

/*    self.listTagTopics = function(start, count, userId, userIP, sToken) {
        var urx = '/tm/',
            verb = Constants.LIST_INSTANCE_TOPICS,
            query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
        query.from = start.toString();
        query.count = count.toString();
        query.inOf = 'TagNodeType';
        query.localVerb = "ListTags";
        console.log("ServerListTagTopics "+JSON.stringify(query));
        httpClient.get(urx, query, function tdLUT(err, rslt) {
            return callback(err, rslt);
        });
    };
*/
    /**
     * Full Text Search
     * @param queryString
     * @param start
     * @param count
     * @param sortBy  e.g. a field, can be <code>null</code>
     * @param sortDir e.g. asc or desc can be <code>null</code>
     * @param userId
     * @param userIP
     * @param sToken
     */
    self.fullTextQuery = function(queryString, start, count,
          sortBy, sortDir, userId, userIP, sToken, callback) {
      var urx = '/tm/',
          verb = Constants.LIST_BY_TEXT_QUERY,
          query = queryUtil.getCoreQuery(verb, userId, userIP, sToken);
      query.from = start.toString();
      query.count = count.toString();
      if (sortBy !== null)
        query.sortBy = sortBy;
      if (sortDir !== null)
        query.sortDir = sortDir;
      query.QueryString = queryString;
      console.log("ServerListByQuery "+JSON.stringify(query));
      httpClient.get(urx, query, function tdLUT(err, rslt) {
          return callback(err, rslt);
      });
    };

};
