var express = require("express"),
    path = require("path"),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    flash = require("connect-flash"),
    bodyParser = require("body-parser"),
    http = require("http"),
    hbs = require("express-hbs"),
    Env = require("./apps/environment"),
    routes = require("./routes/grits/index"),
    app = express(),
    session = require("express-session"),
    uuid = require("node-uuid"),
    fs = require("fs"),
    viewPath = path.join(process.cwd(), "views");
// view engine setup
app.engine("hbs", hbs.express4({
  defaultLayout: path.join(viewPath, "layouts", "layout"),
  partialsDir: __dirname + "/views/partials"
}));
app.set("view engine", "hbs");
app.set("views", viewPath); //path.join(__dirname, "/views"));
app.use(flash());

//Custom handlebars
// used in painting connections
hbs.registerHelper("isSrc", function(context, options) {
  var fnTrue = options.fn,
        fnFalse = options.inverse;
  return (context === "s") ? fnTrue(this) : fnFalse(this);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser()); // collides with session
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  genid: function(req) {
    return uuid.v4(); // use UUIDs for session IDs
  },
  secret: "collaborative sauce"
}));

////////////////////////////
// Plugin Routing
////////////////////////////
////////////////////////////
// Routes are added to Express from each plugin app
// Trailing routes added for 404 errors
////////////////////////////
var MyEnvironment = new Env();
MyEnvironment.init();
/**
 * Fire up an individual app from this <code>file</code>
 * @param file: a .js app file which exports a function(app,database)
 */
function startApp(file) {
  var v = file;
  var px = require("./routes/" + v).plugin;
  px(app, MyEnvironment);
};

/**
 * load all *.js files from the /routes directory
 */
function loadApps() {
  console.log("Server Starting-3");
  require("fs").readdirSync("./routes").forEach(function (file) {
    // only load javascript files
    if (file.indexOf(".js") > -1) {
      console.log("BURP " + file);
      startApp(file);
    }
  });
};
// boot the plugin apps
loadApps();

////////////////////////////
//Server
////////////////////////////
// all environments
app.set("port", parseInt(MyEnvironment.getConfigProperties().port) || 3000);

http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

module.exports = app;
