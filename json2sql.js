
var Json2Sql = (function json2SQL() {
    "use strict";
    function validateJson(jsonString) {
        var jsonData = JSON.parse(jsonString);
        if (typeof jsonData !== 'undefined' && (jsonData.length == undefined || jsonData.length == 0)) {
            throw "the json data doesn't seem to be valid array."
        }
        return jsonData;
    }
    function getValues(itemObj) {
        var values = [];
        for (var x in itemObj) {
            values.push(itemObj[x]);
        }
        return values;
    }
    var naming = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function getColumnName(index) {
        if (index < naming.length) return naming[index];
        var steps = Math.floor(index / naming.length);
        return naming[steps] + getColumnName(index % naming.length)

    }
    function getSelectRow(itemObj, currentIndex, arrayObj) {
        var select = "";
        var items = Object.keys(itemObj);//[Object.keys(itemObj).length - 1]
        var keyCounter = 0;
        for (var i = 0; i < items.length; i++) {
            var val = itemObj[items[i]];
            if(typeof val==="object"){
                continue;
            }
            else if (typeof val === "string") {
                select += "'" + val + "'" ;
            }
            else {
                select += val ;
            }
            if(currentIndex==0){
                select+=" as "+getColumnName(i);
            }
            select+= (i == (items.length-1) ? "" : ", ");
        }

        return select;
    }
    function getSql(jsonString) {
        var arrayData = validateJson(jsonString);
        var selectQuery = "";

        arrayData.forEach(function (element, index) {
            selectQuery += "Select ";

            selectQuery += getSelectRow(element, index, arrayData);
            if (index < (arrayData.length - 1)) { selectQuery += "\nUnion All\n"; }
        });
        return selectQuery;
    }
    return {
        GetSql: getSql
    };
})();