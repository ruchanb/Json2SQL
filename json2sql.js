
var Json2Sql = (function json2SQL() {
    "use strict";
    var options = { ColumnType: 0 };// 0 for auto, 1 for according to key.
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
    function getAutoColumnName(index) {
        if (index < naming.length) return naming[index];
        var steps = Math.floor(index / naming.length);
        return naming[steps] + getAutoColumnName(index % naming.length)

    }
    function getSelectRow(itemObj, currentIndex, arrayObj) {
        var select = "";
        var items = Object.keys(itemObj);//[Object.keys(itemObj).length - 1]
        var keyCounter = 0;
        for (var i = 0; i < items.length; i++) {
            var val = itemObj[items[i]];
            if (typeof val === "object") {
                if (val != null) {
                    continue;
                }else{
                    select+="null";
                }
            }
            else if (typeof val === "string") {
                val = val.replace(/'/g,"''");// escape single quotes
                select += "'" + val + "'";
            }
            else {
                select += val;
            }
            if (currentIndex == 0) {
                select += " as " + (options.ColumnType == "0" ? getAutoColumnName(i) : items[i]);
            }
            select += (i == (items.length - 1) ? "" : ", ");
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
    function getOptValue() {
        console.log(options);
    }
    return {
        Options: options,
        GetSql: getSql,
        getOptValue: getOptValue
    };
})();