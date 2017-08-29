/**
 * Created by park on 11/16/2015.
 * A container for all things related to applications
 * Booted in app.js
 */
var Req = require("./models/drivers/http_request"),
    Blog = require("./models/blog_model"),
    Bm = require("./models/bookmark_model"),
    Common = require("./models/common_model"),
    Constants = require("./constants"),
    Admin = require("./models/admin_model"),
    Conver = require("./models/conversation_model"),
    Kan = require("./models/kanban_model"),
    Tag = require("./models/tag_model"),
    Srch = require("./models/search_model"),
    Usr = require("./models/user_model"),
    Gm = require("./models/guild_model"),
    Qm = require("./models/quest_model"),
    Wiki = require("./models/wiki_model"),
    Tdrvr = require("./models/drivers/topic_driver"),
    Udrvr = require("./models/drivers/user_driver"),
    configProperties = require("../config/config.json"),
    rbuf = require("./ringbuffer"),
//TODO defaults will be replaced by config.json values
    defaults = {
        server: {
            host: "localhost",
            port: 9200
        }
    };

var Environment = function() {
     var self = this,
         httpClient,
         commonModel,
         adminModel,
         blogModel,
         bookmarkModel,
         conversationModel,
         kanbanModel,
         tagModel,
         userModel,
         wikiModel,
         questModel,
         guildModel,
         searchModel,
         topicDriver,
         userDriver,
         backsideURL,
         blogRing,

          wikiRing,
          tagRing,
          conversationRing,
          connectionRing,
          bookmarkRing,
          transcludeRing,

     //view data
         appMenu,
         isInvitationOnly,
         theMessage;
    console.log("Envirionment starting "+httpClient);

    /**
     *
     * @param callback signature err
     */
    self.init = function() {
        console.log("Environment initializing");
        console.log('CONFIG '+JSON.stringify(configProperties));


        //boot in order of need
        //configure HttpClient to talk to BacksideServlet
        httpClient = new Req(configProperties.backsideHost, configProperties.backsidePort, configProperties.backsideProtocol);
        topicDriver = new Tdrvr(this);
        userDriver = new Udrvr(this);
        //have drivers, now app models
        commonModel = new Common(this);
        adminModel = new Admin(this);
        blogModel = new Blog(this);
        bookmarkModel = new Bm(this);
        conversationModel = new Conver(this);
        kanbanModel = new Kan(this);
        tagModel = new Tag(this);
        userModel = new Usr(this);
        wikiModel = new Wiki(this);
        questModel = new Qm(this);
        guildModel = new Gm(this);
        searchModel = new Srch(this);
        backsideURL = configProperties.backsideProtocol+'://'+configProperties.backsideHost+':'+configProperties.backsidePort+'/';
        blogRing = new rbuf(20, "blog", null);
        wikiRing= new rbuf(20, "wiki", null);
        tagRing= new rbuf(20,"tag", null);
        bookmarkRing = new rbuf(20,"bookmark",null);
        conversationRing = new rbuf(20,"conversation",null);
        connectionRing = new rbuf(20, "Connections", null);
        transcludeRing = new rbuf(20, "Transcludes",null);
        console.log("Environment initialized");
    };

    //////////////////////
    // API
    //////////////////////
    self.addApplicationToMenu = function(url, name, isNew) {
        console.log("EnvAddApp "+name);
        if (!appMenu) {appMenu = [];}
        var urx = {};
        urx.url = url;
        urx.name = name;
        urx.isNew = isNew;
        appMenu.push(urx);
    };
    self.getApplicationMenu = function() {
        return appMenu;
    };

    self.setMessage = function(msg) {
        theMessage = msg;
    };

    self.getCoreUIData = function (req) {
        var result = {};
        result.isAuthenticated = req.session[Constants.USER_IS_AUTHENTICATED];
        result.isAdmin = req.session[Constants.USER_IS_ADMIN];
        result.themessage = theMessage;
        result.email = req.session[Constants.USER_EMAIL];
        result.appmenu = appMenu;
        result.isInvitationOnly = isInvitationOnly;
        if (req.flash) {
            result.flashMsg = req.flash("error") || req.flash("success");
        }

        return result;
    };

    self.getBacksideURL = function() {
        return backsideURL;
    };

    self.getConfigProperties = function() {
        return configProperties;
    };

    self.getIsInvitationOnly = function() {
        return configProperties.invitationOnly;
    };

    self.getIsPrivatePortal = function() {
        return configProperties.portalIsPrivate;
    };

    self.getHttpClient = function() {
        return httpClient;
    };

    self.getTopicDriver = function() {
        return topicDriver;
    };

    self.getUserDriver = function() {
        return userDriver;
    };

    self.getSearchModel = function() {
        return searchModel;
    };

    self.getCommonModel = function() {
        return commonModel;
    };

    self.getAdminModel = function() {
        return adminModel;
    };

    self.getBlogModel = function() {
        return blogModel;
    };

    self.getBookmarkModel = function() {
        return bookmarkModel;
    };

    self.getTagModel = function() {
        return tagModel;
    };

    self.getKanbanModel = function() {
        return kanbanModel;
    };

    self.getUserModel = function() {
        return userModel;
    };

    self.getWikiModel = function() {
        return wikiModel;
    };

    self.getQuestModel = function() {
      return questModel;
    };

    self.getGuildModel = function() {
      return guildModel;
    };

    self.getConversationModel = function() {
        return conversationModel;
    };

    /////////////////////////
    // Recent events recording
    //TODO move these to applications, and let them install
    // listeners here to fetch them when needed
    /////////////////////////
    self.addRecentTag = function(locator,label) {
      var d = new Date().getTime();
      var d = new Date().getTime();
      tagRing.add(locator,label,d);
    };
    self.addRecentBlog = function(locator,label) {
      var d = new Date().getTime();
      blogRing.add(locator,label,d);
    },
    self.addRecentWiki = function(locator,label) {
      var d = new Date().getTime();
      wikiRing.add(locator,label,d);
    };
    self.addRecentBookmark = function(locator,label) {
      var d = new Date().getTime();
      bookmarkRing.add(locator,label,d);
    };
    self.addRecentConversation = function(locator,label) {
      var d = new Date().getTime();
      conversationRing.add(locator,label,d);
    };
    self.addRecentConnection = function(locator,label) {
        var d = new Date().getTime();
        connectionRing.add(locator,label,d);
    };

    self.listRecentTags = function() {
      return tagRing.getReversedData();
    };
    self.listRecentBlogs = function() {
      return blogRing.getReversedData();
    };
    self.listRecentWikis = function() {
      return wikiRing.getReversedData();
    };
    self.listRecentBookmarks = function() {
      return bookmarkRing.getReversedData();
    },
    self.listRecentConversations = function() {
      return conversationRing.getReversedData();
    };

    self.listRecentConnections = function() {
        return connectionRing.getReversedData();
    };
};

module.exports = Environment;
