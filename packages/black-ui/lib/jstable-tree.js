// JS Table Tree
// Provides a means of adding a tree structure to one column of table data
//
var JSTT = (function() {
    let jstt = {};

    let observer = new MutationObserver(
        _updateTree
    );

    //$('.js-table-tree').each(function (i, node) {observer.observe(node)});
//
//    $(document).ready(function () {
//        // Initialise and correct table tructure according to data
//console.log("hello");
//        // Attach observer so that asynchronous changes are accounted for
////        $('.js-table-tree').bind("DOMSubtreeModified", _updateTree);
//    });


    function _updateTree() {
        console.log('HIT');
    }

    return jstt;
}());