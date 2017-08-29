/**
 * Created by park on 11/16/2015.
 */
///////////////////////////
// language defaults
///////////////////////////
module.exports.ENGLISH		    =       "en";
///////////////////////////
// backside stuff
///////////////////////////
module.exports.SYSTEM_USER	    =     "SystemUser";
module.exports.GUEST_USER       =     "GuestUser";
module.exports.MAX_HIT_COUNT    =      30;
module.exports.TOPICS_INDEX		=        "topics";

//VERBS
module.exports.ADD_FEATURES_TO_TOPIC =  "AddFeatures"; //topicmap
//NOTE =  AddFeatures can handle TAG_NAMES_PROP and URL_PROP
//TODO add more features to BacksideServlet for that
module.exports.GET_TOPIC =              "GetTopic"; //topicmap
module.exports.PUT_TOPIC =              "PutTopic"; //topicmap
module.exports.UPDATE_TOPIC			=       "UpdateTopic"; //topicmap
module.exports.ADD_RELATION			=       "AddRelation";
module.exports.UPDATE_TOPIC_TEXT_FIELDS= "UpdateTextFields"; //topicmap
module.exports.REMOVE_TOPIC =           "RemTopic"; //topicmap
module.exports.NEW_INSTANCE_TOPIC =     "NewInstance"; //topicmap
module.exports.NEW_SUBCLASS_TOPIC =     "NewSub"; //topicmap
module.exports.NEW_CONVERSATION_NODE	= "NewConvNode"; // topicmap
module.exports.NEW_USER =               "NewUser"; //userapp
module.exports.LIST_INSTANCE_TOPICS =   "ListInstances"; //topicmap
module.exports.LIST_SUBCLASS_TOPICS =   "ListSubclasses"; //topicmap
module.exports.LIST_USERS =             "ListUsers"; //topicmap & userapp
module.exports.GET_USER =               "GetUser"; // userappE
module.exports.REMOVE_USER  =           "RemUser"; //userapp post
module.exports.AUTHENTICATE =           "Auth";
module.exports.VALIDATE =               "Validate";
module.exports.EXISTS_EMAIL	=           "ExstEmail";
module.exports.NEW_INVITE =             "NewInvite";
module.exports.REMOVE_INVITE =          "RemoveInvite";
module.exports.EXISTS_INVITE =          "ExistsInvite";
module.exports.LIST_INVITES =           "ListInvites";
module.exports.UPDATE_ROLE =            "UpdUsRol";
module.exports.REMOVE_ROLE		=         "RemUsRol";
module.exports.UPDATE_EMAIL =           "UpdUsEma";
module.exports.UPDATE_PASSWORD =        "UpdUsPwd";
module.exports.UPDATE_USER_DATA		=     "UpdUsDat";
module.exports.LOAD_TREE =              "LoadTree";
module.exports.GET_SEARCH_PARAMS =      "GetSearchParams";
module.exports.LOGOUT =                 "LogOut";
module.exports.FIND_OR_PROCESS_TAG =    "FindProcessTag";
module.exports.FIND_OR_CREATE_BOOKMARK= "FindProcessBookmark";
module.exports.LIST_TREE_CHILD_NODES	= "ListTreeNodes";
module.exports.COLLECT_CONVERSATION_TREE	= "ColConTree";
//module.exports.LIST_ALL_BLOG_POSTS		= "ListAllBlogs";
module.exports.LIST_BLOGS_BY_USER		=   "ListUserBlogs";
module.exports.TRANSCLUDE   =           "Transclude";
module.exports.LIST_BY_TEXT_QUERY			= "ListByTextQuery"; //full text search
//RPG VERBS
module.exports.ADD_LEADER			=         "AddLeader";
module.exports.REMOVE_LEADER		=       "RemoveLeader";
module.exports.ADD_MEMBER			=         "AddMember";
module.exports.REMOVE_MEMBER		=       "RemoveMember";

//NODE PROPERTIES
module.exports.CREATORID_PROP =         "crtr";
module.exports.DETAILS_PROP =           "details";
module.exports.INSTANCE_OF_PROP =       "inOf";
module.exports.IS_PRIVATE_PROP =        "isPrv"; // takes "t" or "f" case insensitive
module.exports.LABEL_PROP =             "label";
module.exports.LANGUAGE_PROP =          "Lang";
module.exports.LARGE_IMAGE_PROP =       "lIco";
module.exports.SMALL_IMAGE_PROP =       "sIco";
module.exports.LOCATOR_PROP =           "lox";
module.exports.SUBCLASS_OF_PROP =       "sbOf";
module.exports.TAG_NAMES_PROP =         "TagNames";  //takes an array [name, name, name]
module.exports.URL_PROP =               "url";
module.exports.EXTRAS   =               "extras"; // field with a JSONObject with added key/value pairs for newInstance
//CARGO PROPERTIES
module.exports.REL_SRC_LOCATOR				= "RelSrcLoc",
module.exports.REL_TRG_LOCATOR				= "RelTrgLoc",
module.exports.REL_TYPE_LOCATOR				= "RelTypLoc",

//NODE TYPES
module.exports.ANNOTATION_NODE_TYPE =   "AnnotationType";
module.exports.BOOKMARK_NODE_TYPE =     "BookmarkNodeType";
module.exports.CHALLENGE_TYPE =         "ChallengeNodeType";
module.exports.ISSUE_TYPE =             "IssueNodeType";
module.exports.EVIDENCE_TYPE =          "EvidenceNodeType";
module.exports.CLAIM_TYPE =             "ClaimNodeType";
module.exports.RESOURCE_TYPE =          "ResourceNodeType";
module.exports.GUILD_TYPE =             "GuildNodeType";
module.exports.QUEST_TYPE =             "QuestNodeType";
module.exports.AVATAR_TYPE =            "AvatarNodeType";
module.exports.TAG_TYPE =               "TagNodeType";
module.exports.USER_TYPE =              "UserType";
module.exports.THEME_TYPE =             "ThemeNodeType";
module.exports.PRO_TYPE =               "ProNodeType";
module.exports.CON_TYPE =               "ConNodeType";
module.exports.SOLUTION_TYPE =          "SolutionNodeType";
module.exports.POSITION_TYPE =          "PositionNodeType";
module.exports.CONVERSATION_MAP_TYPE =  "ConversationMapNodeType";
module.exports.ONTOLOGY_NODE_TYPE =     "OntologyNodeType";
module.exports.GRAPH_NODE_TYPE =        "GraphNodeType";
module.exports.BLOG_TYPE				=       "BlogNodeType";
module.exports.WIKI_TYPE              = "WikiNodeType";
module.exports.MICROBLOG_TYPE			=     "MicroblogNodeType";

//RELATIONS
module.exports.DOCUMENT_CREATOR_RELN =  "DocumentCreatorRelationType";
module.exports.TAG_BOOKMARK_RELN =      "TagDocumentRelationType";
//IMAGES
    //TODO there are more images
module.exports.CLASS_ICON =             "/images/cogwheel.png";
module.exports.CLASS_ICON_SM =          "/images/cogwheel_sm.png";
module.exports.RELATION_ICON =          "/images/cogwheels.png";
module.exports.RELATION_ICON_SM =       "/images/cogwheels_sm.png";
module.exports.PROPERTY_ICON =          "/images/snowflake.png";
module.exports.PROPERTY_ICON_SM =       "/images/snowflake_sm.png";
module.exports.PERSON_ICON =            "/images/person.png";
module.exports.PERSON_ICON_SM =         "/images/person_sm.png";
module.exports.GROUP_ICON =             "/images/group.png";
module.exports.GROUP_ICON_SM =          "/images/group.png";
module.exports.ISSUE =                  "/images/ibis/issue.png";
module.exports.ISSUE_SM =               "/images/ibis/issue_sm.png";
module.exports.POSITION =               "/images/ibis/position.png";
module.exports.POSITION_SM =            "/images/ibis/position_sm.png";
module.exports.CLAIM =                  "/images/ibis/claim.png";
module.exports.CLAIM_SM =               "/images/ibis/claim_sm.png";
module.exports.REFERENCE =              "/images/ibis/reference.png";
module.exports.REFERENCE_SM =           "/images/ibis/reference_sm.png";
module.exports.PRO =                    "/images/ibis/plus.png";
module.exports.PRO_SM =                 "/images/ibis/plus_sm.png";
module.exports.CON =                    "/images/ibis/minus.png";
module.exports.CON_SM =                 "/images/ibis/minus_sm.png";
module.exports.MAP =                    "/images/ibis/map.png";
module.exports.MAP_SM =                 "/images/ibis/map_sm.png";
module.exports.CHALLENGE =              "/images/ibis/challenge.png";
module.exports.CHALLENGE_SM =           "/images/ibis/challenge_sm.png";
module.exports.SOLUTION =               "/images/ibis/decision.png";
module.exports.SOLUTION_SM =            "/images/ibis/decision_sm.png";
module.exports.PROJECT =                "/images/project.png";
module.exports.PROJECT_SM =             "/images/project_sm.png";
module.exports.ONTOLOGY =               "/images/ontology.png";
module.exports.ONTOLOGY_SM =            "/images/ontology_sm.png";
module.exports.PUBLICATION =            "/images/publication.png";
module.exports.PUBLICATION_SM =         "/images/publication_sm.png";
module.exports.LITERATURE_ANALYS =      "/images/literature-analysis.png";
module.exports.LITERATURE_ANALYS_SM =   "/images/literature-analysis_sm.png";
module.exports.ORGANIZATION =           "/images/organization.png";
module.exports.ORGANIZATION_SM =        "/images/organization_sm.png";
module.exports.BOOKMARK =               "/images/bookmark.png";
module.exports.BOOKMARK_SM =            "/images/bookmark_sm.png";
module.exports.TAG =                    "/images/tag.png";
module.exports.TAG_SM =                 "/images/tag_sm.png";
module.exports.THEME =                  "/images/theme.png";
module.exports.THEME_SM =               "/images/theme_sm.png";
module.exports.LINK =                   "/images/link.png";
module.exports.LINK_SM =                "/images/link_sm.png";
module.exports.GUILD =                   "/images/game/guild.png";
module.exports.GUILD_SM =                "/images/game/guild_sm.png";
module.exports.QUEST =                   "/images/game/quest.png";
module.exports.QUEST_SM =                "/images/game/quest_sm.png";

module.exports.CHILD_NODE_LIST =        "cNL";
//CREDENTIALS
module.exports.ADMIN_CREDENTIALS        ="rar";
//SESSION OBJECTS
module.exports.SESSION_TOKEN =          "SessToken";
module.exports.USER_EMAIL =             "SessUsrEmail";
module.exports.USER_ID =                "SessUserId";
module.exports.USER_HANDLE =            "SessUserHdl";
module.exports.USER_IS_ADMIN =          "SessUsrAdmin";  //will be true or null
module.exports.THE_USER  =              "SessionUser";
module.exports.USER_IS_AUTHENTICATED =  "SessUserAuth"; //will be true or null

//QUERY FIELDS
module.exports.SORT_START	    = "start";
module.exports.SORT_COUNT	    = "count";
module.exports.SORT_BY		    = "sortBy";
module.exports.SORT_DIR	      = "sortDir";
module.exports.SORT_DATE	    = "crDt"; 	//sortBy: "crDt"
module.exports.SORT_LABEL	    = "label";	//sortBy: "label" -- alphabetical sort
module.exports.SORT_VAL	      = "val";	//sortBy: "val" -- a value number
module.exports.SORT_CREATOR   = "crtr",	//sortBy: "crtr"

module.exports.ASC_DIR		    = "asc";	//sortDir: "asc"
module.exports.DSC_DIR		    = "desc";	//sortDir: "dsc"
