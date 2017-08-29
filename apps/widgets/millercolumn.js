/**
 * Created by park on 1/13/2016.
 */
var Sb = require("../stringbuilder"),
    Constants = require("../constants"),
    MillerColumn;

MillerColumn = module.exports = function(environment) {
    var self = this,
        topicDriver = environment.getTopicDriver(),
        buffer = new Sb(),
        undefined; // leave empty

    function listChildNodes(node, context) {
        var result = [];
        var kids = node.cNL;
        if (kids) {
            if (context === "") {
                result = kids;
            } else {
                var len = kids.length,
                    child;
                //TODO here we are assuming child is a JSON object
                // but it might just be a string that needs to be parsed
                for (var i = 0; i < len; i++) {
                    child = kids[i];
                    console.log("MC-CHILD "+child);
                    if (child.contextLocator === context) {
                        result.push(child);
                    }
                }
            }
        }
        return result;
    };
    /**
     * Make a given node and add it to <code>buf</code>
     * @param node
     * @param language
     * @param javascript function
     * @param app  e.g. "/conversation/ajaxfetch/"
     * @param aux e.g. "" or "&foo=bar"
     * @param buf
     * @param contextLocator
     * @param rootNodeLocator
     */
    function __makeNodeHTML(node, language, javascript, app, aux, buf, contextLocator,
              rootNodeLocator) {
        console.log("ColNavWidget.__makeNodeHTML "+JSON.stringify(node)+" "+buf);
        //TODO modify this to deal with JSON
        buf.append("<li id=\""+node.lox+"\"><a class=\"nodehref\" href=\"");
        var query = javascript+"('"+node.lox+"', '"+app+node.lox+"?contextLocator="+contextLocator+"&rootLocator="+rootNodeLocator+"&language="+language+aux+"')\"";        buf.append(query+" ondblclick =\"doDoubleClick();\">");
        buf.append("<img src=\""+node.sIco+"\" class=\"nodeimg\"> ");
        title = node.label; //TODO getLabel(constants.ENGLISH);
        if (!title) {
            title = node.details[0]; //TODO getSubject(constants.ENGLISH).theText;
        }
        buf.append("<span class='nodetitle'>"+title+"</span></a>"); // leave off trailing </li>
//		console.log("ColNavWidget.__makeNodeHTML+ "+node.getLocator()+" "+buf);
    };

    /**
     * A possibly recursive system to craft a ColNav tree rooted in <code>rootNode</code>
     * The code fills <code>buf</code> and returns buf.toString(); (note: nobody uses it)
     * We enter this with the rootNode already painted in <code>buf</code> but missing
     * its trailing </li>
     * @param rootNodeLocator used in querystring to keep track of root
     * @param rootNode
     * @param selectedNode
     * @param contextLocator
     * @param language
     * @param javascript
     * @param app
     * @param buf  a StringBuilder
     * @param userId
     * @param userIP
     * @param sToken
     * @param stop
     * @param callback signature (err,html)
     */
    function __buildColNav(rootNodeLocator, rootNode, selectedNode, contextLocator,
                          language, javascript, app,
                          aux, buf, userId, userIP, sToken, stop,  callback) {
        var error = "";
        console.log("ColNavWidget.__buildColNav "+rootNodeLocator+" "+rootNode);
        buf.append(__makeNodeHTML(rootNode, language, javascript, app, aux, buf, contextLocator, rootNodeLocator));
		console.log("ColNavWidget.__buildColNav-1 "+buf.toString());
        //complex: rootNode will change with recursion on children
        //when rootNode === selectedNode, paint its kids, then stop
        var stop = (rootNode.lox === selectedNode.lox),
            kids = listChildNodes(rootNode, contextLocator);
//		console.log("ColNavWidget.__buildColNav-2 "+kids);

        if (kids && kids.length > 0) {
//			console.log("ColNavWidget.__buildColNav-3 "+kids.length);

            buf.append("<ul>");
            var len = kids.length;
            var cursor = 0;
            var nx; //childstruct.js
            function loop() {
                // stop?
                if (cursor >= len) {
                    buf.append("</ul>");
//					console.log("ColNavWidget.__buildColNav-6 "+buf.toString());

                    return callback(error, buf.toString());
                } else {
                    nx = kids[cursor++];
//					console.log("ColNavWidget.__buildColNav-4 "+JSON.stringify(nx));
                    topicDriver.grabTopic(nx.locator, userId, userIP, sToken, function widgetMGetNode(err, node) {
                        if (err) {error+=err;}
                        if (node) {
//						console.log("ColNavWidget.__buildColNav-5 "+stop+" | "+err+" | "+node);
                            __buildColNav(rootNodeLocator, node.cargo, selectedNode, contextLocator, language,
                                javascript, app, aux, buf, userId, userIP, sToken, stop, function mcB1(err,html) {
                                if (err) {error+=err;}
                                loop();
                            });
                        } else {
                            loop();
                        }

                    });
                }
            };
            loop();
        } else {
//			console.log("ColNavWidget.__buildColNav-7 "+buf.toString());
            return callback(error, buf.toString());
        }
    };



    /**
     * Recursively paint colnav treenodes starting from <code>rootNodeLocator</code>,
     * and stopping when selectedNode is added to the tree. It's possible that
     * <code>rootNodeLocator</code> is the same as <code>selectedNode</code>
     * NOTE: an argument can be made that rootNodeLocator and contextLocator should be the same value. But
     * notice that we are using contextLocator as a signal whether to show just this context, or all possible
     * child nodes
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
     * @param callback signature (err,colnavhtml)
     */
    self.makeColNav = function(rootNodeLocator, selectedNode, contextLocator,
                              language, javascript, app, aux,
                               userId, userIP, sToken , callback) {
        var buffer = new Sb(),
            error;
//		console.log("ColNavWidget.makeColNav "+buffer);
        if (selectedNode.lox === rootNodeLocator) {
            console.log("ColNavWidget.makeColNav-1 "+rootNodeLocator+" | "+selectedNode);
            __buildColNav(rootNodeLocator, selectedNode, selectedNode, contextLocator,
                language, javascript, app, aux, buffer, userId, userIP,
                sToken, false, function widgetMBuildColNav(err, html) {
//				console.log("ColNavWidget.makeColNav-1 "+html);
                buffer.append("</li>");
                return callback(err, buffer.toString());
            });
        } else {
            topicDriver.grabTopic(rootNodeLocator, userId, userIP, sToken, function widgetMGetNode1(err, node) {
                console.log("ColNavWidget.makeColNav-2 "+rootNodeLocator+" | "+node+" | "+selectedNode);
                if (node) {
                    __buildColNav(rootNodeLocator, node.cargo, selectedNode,
                        contextLocator, language, javascript, app, aux, buffer,
                        userId, userIP, sToken, false, function widgetMBuildColNav1(err, html) {
                        //					console.log("ColNavWidget.makeColNav-2 "+html);
                        buffer.append("</li>");
                        return callback(err, buffer.toString());
                    });
                } else {
                    return callback(error, buffer.toString());
                }
            });
        }
    };
};
