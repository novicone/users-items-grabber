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

loadRecordsFromCsv().then(run).then(function() {
    var rows = records.concat(oldRecords).map(function(record) {
        return [record.username, record.userId, record.itemId];
    });
    return q.denodeify(csv.stringify)(rows).then(function(csv) {
        fs.writeFileSync(csvFileName, csv);
    });
}).done();

function loadRecordsFromCsv() {
    if (!fs.existsSync(csvFileName)) {
        return q.when();
    }
    return q.denodeify(csv.parse)(fs.readFileSync(csvFileName).toString()).then(function(rows) {
        oldRecords = rows.map(rows[0].length === 3 ? read3 : read2);
        lastRecord = oldRecords[0];

        function read2(row) {
            return {
                username: "",
                userId: row[1],
                itemId: row[2]
            };
        }

        function read3(row) {
            return {
                username: row[0],
                userId: row[1],
                itemId: row[2]
            };
        }
    });
}

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

function loadPage(url) {
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
    return defer.promise.then(function(html) {
        return cheerio.load(html);
    });
}

function findUsersItems($) {
    var items = [];
    $(".feedbacks-row").each(function(_, row) {
        var $row = $(row);
        $showFeedbackLink = $row.find(".showFeedback");
        items.push({
            username: $row.find(".uname a").text(),
            userId: $showFeedbackLink.data("userId"),
            itemId: $showFeedbackLink.data("itemId")
        });
    });
    return items;
}
