var cheerio = require("cheerio");
var http = require("http");
var fs = require("fs");
var q = require("q");
var util = require("util");
var csv = require("csv");

var userId = process.argv.slice().pop();
if (!userId.match(/^\d+$/)) {
    util.error("Niepoprawny identyfikator użytkownika - jest obowiązkowy i musi składać się wyłącznie z cyfr");
    process.exit(1);
}

var urlTemplate = "http://allegro.pl/show_user.php?uid=%s&feedback_type=fb_recvd_all&type=fb_seller&p=%s";

var csvFileName = userId + ".csv";
var oldRecords = [];
var records = [];
var lastRecord = null;

var currentPage = 1;

asyncUtils.csvLoad(csvFileName).then(function(rows) {
    var oldRecords = auctionRowsToObjects(rows);
    var lastRecord = oldRecords[0];

});

loadRecordsFromCsv().then(run).then(function() {
    var rows = records.concat(oldRecords).map(function(record) {
        return [record.userName, record.userId, record.itemId];
    });
    return q.denodeify(csv.stringify)(rows).then(function(csv) {
        fs.writeFileSync(csvFileName, csv);
    });
}).done();

function run() {
    var currentUrl = util.format(urlTemplate, userId, currentPage);
    console.log("Czytam %s", currentUrl);
    currentPage++;
    return loadPage(currentUrl).then(findUsersItems).then(function(currentRecords) {
        if (currentRecords.length === 0) {
            return;
        }
        for (var i = 0; i < currentRecords.length; i++) {
            var record = currentRecords[i];
            if (lastRecord && lastRecord.userId == record.userId && lastRecord.itemId == record.itemId) {
                return;
            }
            records.push(record);
        }
        return run();
    });
}