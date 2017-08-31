/**
 * Created by park on 8/30/2017.
 */

 var Constants = require('../../constants'),
     CWDriver;

 CWDriver =  module.exports = function(environment) {
     var self = this,
         httpClient = environment.getHttpClient();
         
     console.log("CWDriver "+httpClient);

     /**
      * fetch a guild's meta-conversation
      * @param locator
      * @param callback
      */
     self.getConversationMap = function(locator, callback) {
       //TODO
     };

     /**
      * Create a new guild meta-conversation map
      * @param jsonMap -- the template to save
      * @param callback
      */
     self.createConverstionMap = function(jsonMap, callback) {
       //TODO
     };
 };
