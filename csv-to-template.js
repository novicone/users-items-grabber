

var args = process.argv.slice(2);

assert(args.length == 2, "Składnia: node csv-to-template nazwa_pliku szablon");

var fs = require("fs");
var csv = require("csv");

var fileName = args[0];
var template = args[1];

csv.parse(fs.readFileSync(fileName).toString(), function(error, rows) {
    assert(error == null, error);

    rows.forEach(function(row) {
        console.log(template.replace(/%%(\d+)/g, function(_, index) {
            return row[index];
        }));
    });
});

function assert(cond, message) {
    if (!cond) {
        console.error(message);
        process.exit(1);
    }
}