/**
 * Created by park on 11/16/2015.
 */
var Constants = require("../constants"),
    TagModel;

TagModel =  module.exports = function(environment) {
  var self = this,
      CommonModel = environment.getCommonModel(),
      topicDriver = environment.getTopicDriver();
  console.log("Tag "+topicDriver);

  self.fillDatatable = function(start, count, userId, userIP, sToken, callback) {
      console.log("TagModel.fillDatatable "+userId);
      topicDriver.listInstanceTopics(Constants.TAG_TYPE, start, count,
        Constants.SORT_LABEL, Constants.ASC_DIR,
        userId, userIP, sToken, function bmF(err, rslt) {
        console.log("LISTTags "+err+" | "+JSON.stringify(rslt));
        var count = 0,
            d = rslt.cargo;
        if (d) {
          count = d.length;
        }
        return callback(err, rslt, count, 0);
      });
   };

   self.addTags = function(json, userId, userIP, sToken, callback) {
     console.log("TagModel.addTags "+JSON.stringify(json));
     //{"locator":"1eaa8fe2-4f48-4210-be86-f6d99e90ed2b","tag1":"Tag A","tag2":"Tag B","tag3":"","tag4":""}
     var tags = [];
     if (json.tag1 !== "") {
       tags.push(json.tag1);
     }
     if (json.tag2 !== "") {
       tags.push(json.tag2);
     }
     if (json.tag3 !== "") {
       tags.push(json.tag3);
     }
     if (json.tag4 !== "") {
       tags.push(json.tag4);
     }
     topicDriver.findOrProcessTags(json.locator, tags, json.language, userId, userIP, sToken, function tmA(err, rslt) {
       console.log("TagModel.addTags+ "+err+" | "+rslt);
       return callback(err, rslt);
     });
   };

   function renderPivot(piv) {
       var shell = {};
       shell.lox = piv.documentLocator;
       shell.sIco = piv.documentSmallIcon;
       shell.label = piv.documentLabel;
       return shell;
   };

   function extractDocumentPivots(pivots) {
       var x,
           i,
           shell,
           piv,
           boox = false,
           list = [],
           len = pivots.length,
           result = undefined;

       for (i =0; i<len; i++) {
           piv = pivots[i];
           console.log("PIV "+piv.relationType+" "+JSON.stringify(piv));
           if (piv.documentType !== Constants.USER_TYPE &&
               piv.documentType !== Constants.TAG_TYPE) {
               boox = true;
               shell = renderPivot(piv);
               shell.doctype = piv.documentType;
               ////////////////////////////
               // hand-tuned typing
               // TODO this must be modified for additional node types
               // TODO let each app install its own in a map???
               ////////////////////////////
               if (piv.documentType === Constants.BLOG_TYPE) {
                 shell.isBlogType = true;
               } else if (piv.documentType === Constants.WIKI_TYPE) {
                 shell.isWikiType = true;
               } else if (piv.documentType === Constants.BOOKMARK_NODE_TYPE) {
                 shell.isBookmark = true;
               } else if (piv.documentType === Constants.ANNOTATION_NODE_TYPE) {
                 shell.isAnnotation = true;
               }//TODO conversation types?

               list.push(shell);
           }
       }
       console.log("FOODOC "+JSON.stringify(list));
       if (boox) {
           result = list;
       }
       return result;
   };

   self.listDocumentsForHelpTopicTag = function(json, userId, userIP, sToken, callback) {
     CommonModel.fetchTopic("help_topic_TAG", userId, userIP, sToken, function bFT(err, rslt) {
       console.log("TagModelxx "+rslt);
       if (rslt.cargo) {
         var pivots = rslt.cargo.pvL;
         if (pivots) {
           var piv = extractDocumentPivots(pivots);
           if (piv) {
             json.showDocs = true;
             json.documents = piv;
           }
         }
       }
       return callback();
     });
   }
};
