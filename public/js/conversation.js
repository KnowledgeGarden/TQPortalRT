/**
 * Created by park on 1/14/2016.
 * Support for the MillerColumn conversation tree
 */
var navtoggle = false;
var currentLocator;
var locator;
var query;

function paintColNav(data) {
    var html = data.colnav;
//	alert("HTML "+html);
    $("ul#myConTree").html(html);
}

function getConversationNode(query) {
	alert("XX "+query);
    $.get( query, function( data ) {
		alert(data);
        currentLocator = data.locator;
        if (!navtoggle) {
            paintColNav(data);
            $("ul#myConTree").columnNavigation({
                containerPosition:"relative",
                containerWidth:"900px",
                containerHeight:"210px",
                containerBackgroundColor:"rgb(255,255,255)",
                containerFontColor:"rgb(50,50,50)",
                columnWidth:300,
                columnFontFamily:"'Helvetica Neue', 'HelveticaNeue', Helvetica, sans-serif",
                columnFontSize:"90%",
                columnSeperatorStyle:"1px solid rgb(220,220,220)",
                columnDeselectFontWeight:"normal",
                columnDeselectColor:"rgb(50,50,50)",
                columnSelectFontWeight:"normal",
                columnSelectColor:"rgb(255,255,255)",
                columnSelectBackgroundColor:"rgb(27,115,213)",
                columnSelectBackgroundPosition:"top",
                columnItemPadding:"3px 3px 5px 3px",
                columnScrollVelocity:50
            });
            navtoggle = true;
        }
    });
}

function fetchFromTree(lox, quex) {
    locator = lox;
    query = quex;
    if (locator !== currentLocator) {
        currentLocator = locator;
        getConversationNode(query);
    }
}
