/**
 * Created by park on 5/28/2016.
 */
var Constants = require("../constants"),
    RDriver = require("./drivers/rpg_driver"),
    RpgModel;

RpgModel =  module.exports = function(environment) {
    var self = this,
        rpgDriver = new RDriver(environment),
        CommonModel = environment.getCommonModel();
    console.log("RPGModel "+rpgDriver);

};
