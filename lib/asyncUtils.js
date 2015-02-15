/**
 * Created by novic on 15.02.15.
 */

var q = require("q");
var fs = require("fs");
var http = require("http");
var csv = require("csv");

module.exports = {
    httpGet: function(url) {
        var defer = q.defer();
        var request = http.request(url, function(response) {
            var body = "";
            response.on("data", function(chunk) {
                body += chunk.toString();
            });
            response.on("end", function() {
                defer.resolve(body);
            });
        });

        request.on("error", function(error) {
            defer.reject(error);
        });
        request.end();

        return defer.promise;
    },
    csvLoad: function(fileName) {
        if (!fs.existsSync(fileName)) {
            return q.when();
        }
        return q.denodeify(csv.parse)(fs.readFileSync(fileName).toString());
    },
    csvSave: function(fileName, rows) {
        return q.denodeify(csv.stringify)(rows).then(function(csv) {
            fs.writeFileSync(fileName, csv);
        })
    },
    whileDo: function(cond, toDo) {
        var d = q.defer();

        function iterate() {
            if (cond()) {
                toDo().then(iterate).catch(function(error) {
                    d.reject(error);
                });
            } else {
                d.resolve();
            }
        }

        return d.promise();
    },
    whileDoTest: function() {
        var i = 1;
        var lastResult;
        var allResults = [];
        return this.whileDo(function() {
            return lastResult === undefined || lastResult.length > 0;
        }, function() {
            return this.httpGet("" + i++).then(function(result) {
                lastResult = result;
                allResults = allResults.concat(result);
            })
        })
    }
};