/**
 * Created by park on 8/30/2017.
 */

 var Constants = require('../../constants'),
     CWDriver;

 CWDriver =  module.exports = function(environment) {
     var self = this,
         httpClient = environment.getHttpClient();
     console.log("CWDriver "+httpClient);

 };
