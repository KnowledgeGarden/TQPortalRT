var Constants = require("../constants"),
    CwD = require("./drivers/conwidget_driver"),
    ConwidgetModel;

ConwidgetModel =  module.exports = function(environment) {
    var self = this,
        driver = new CwD(environment);
    console.log("Conwidget "+driver);

};
