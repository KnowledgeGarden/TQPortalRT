/**
 * Created by park on 11/15/2016.
 * The simplest possible conversation tree: just an HTML list
 */
var Sb = require("../stringbuilder"),
     JSTREE;

JSTREE = module.exports = function(environment) {
   var self = this,
       topicDriver = environment.getTopicDriver();

/**
 * The recursive function itself
 * @param suppressRoot
 * @param data -- the growing HTML tree code
 * @param context -- the root node locator for this conversation
 * @param jsonTree -- a specific tree node from BacksideServleet
 */
function __makeTree(suppressRoot, data, context, jsonTree) {
   console.log("MKTREE "+jsonTree);
   var thisRoot = jsonTree.root,
       kids = jsonTree.kids;
   //console.log("THISROOT "+JSON.stringify(thisRoot));
   if (!suppressRoot)  {
     data.append("<li>");
     data.append("<a href='/conversation/"+thisRoot.lox+"/?contextLocator="+context+"' >");//target='_top'
     data.append("<img src='"+thisRoot.sIco+"'> "+thisRoot.label+"</a>");
   }
   //kids
   if (kids) {
     var len = kids.length;
     data.append("<ul>");
     for (var i=0; i<len; i++) {
       //recurse
       __makeTree(false, data, context, kids[i]);
     }
     data.append("</ul>");
   }
   if (!suppressRoot) {
     data.append("</li>");
   }
 };
 /**
  * Recursively paint colnav treenodes starting from <code>rootNodeLocator</code>,
  * and stopping when selectedNode is added to the tree. It's possible that
  * <code>rootNodeLocator</code> is the same as <code>selectedNode</code>
  * NOTE: an argument can be made that rootNodeLocator and contextLocator should be the same value. But
  * notice that we are using contextLocator as a signal whether to show just this context, or all possible
  * child nodes
  * @param suppressRoot  <code>true</code> means don't paint root node
  * @param rootNodeLocator
  * @param selectedNode
  * @contextLocator if "", then takes all child contexts
  * @param language
  * @param javascript
  * @param app  e.g. /conversation/ajaxfetch/
  * @param aux e.g. "" or "&foo=bar"
  * @param userId
  * @param userIP
  * @param sToken
  * @param callback signature (err,jsondata)
  */
 self.makeTree = function(suppressRoot, rootNodeLocator, contextLocator, userId, userIP, sToken, callback) {
   var data = new Sb(); //the HTML string goes here
   data.append("<ul>");
   // Call BacksideServlet to assemble a tree for this root and context
   topicDriver.collectParentChildTree(rootNodeLocator, contextLocator,
         userId, userIP, sToken, function jtC(err, rootObject) {
     var jsonTree = rootObject.cargo;
     //recursively build the HTML tree
     __makeTree(suppressRoot,data, contextLocator, jsonTree);

     data.append("</ul>");
     //console.log("MAKETREE "+err+" | "+data.toString());
     return callback(err, data.toString());
   });
 };
};
 /**
 What ... returns:
 {"rMsg":"ok","rToken":"","cargo":{"root":{"cNL":[{"contextLocator":"b921a18c-5677-4ea6-b076-f6f11dec3e9f","smallImagePath":"/images/ibis/issue_sm.png","subject":"Third Test Question","locator":"25238ebf-7735-49ff-8bcb-14467da1b30e"}],"crtr":"joe","pvL":[{"relationType":"DocumentCreatorRelationType","documentLocator":"joe","relationLocator":"b921a18c-5677-4ea6-b076-f6f11dec3e9fDocumentCreatorRelationTypejoe","documentLabel":"Joe Sixpack","documentType":"UserType","relationLabel":"DocumentCreatorRelationType","documentSmallIcon":"/images/person_sm.png"}],"_ver":"1479348013803","lEdDt":"2016-11-16T18:00:13-08:00","label":["First post"],"inOf":"BlogNodeType","crDt":"2016-11-13T17:32:09-08:00","trCl":["TypeType","ClassType","NodeType","BlogNodeType"],"lox":"b921a18c-5677-4ea6-b076-f6f11dec3e9f","sIco":"/images/publication_sm.png","isPrv":false,"details":["We really need to be able to say something useful."],"lIco":"/images/publication.png"},
 "kids":[{"root":{"cNL":[],"crtr":"joe","pvL":[{"relationType":"DocumentCreatorRelationType","documentLocator":"joe","relationLocator":"25238ebf-7735-49ff-8bcb-14467da1b30eDocumentCreatorRelationTypejoe","documentLabel":"Joe Sixpack","documentType":"UserType","relationLabel":"DocumentCreatorRelationType","documentSmallIcon":"/images/person_sm.png"}],"_ver":"1479182813508","lEdDt":"2016-11-14T20:06:53-08:00","label":["Third Test Question"],"inOf":"IssueNodeType","pNL":[{"contextLocator":"b921a18c-5677-4ea6-b076-f6f11dec3e9f","smallImagePath":"/images/publication_sm.png","subject":"First post","locator":"b921a18c-5677-4ea6-b076-f6f11dec3e9f"}],"crDt":"2016-11-14T20:06:53-08:00","trCl":["TypeType","ClassType","NodeType","IssueNodeType"],"lox":"25238ebf-7735-49ff-8bcb-14467da1b30e","sIco":"/images/ibis/issue_sm.png","isPrv":false,"details":["Sup?"],"lIco":"/images/ibis/issue.png"}}]}}
 */
