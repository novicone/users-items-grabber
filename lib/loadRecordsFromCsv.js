/**
 * Created by novic on 15.02.15.
 */


function loadRecordsFromCsv() {
    if (!fs.existsSync(csvFileName)) {
        return q.when();
    }
    return q.denodeify(csv.parse)(fs.readFileSync(csvFileName).toString()).then(function(rows) {
        oldRecords = rows.map(function(row) {
            if (row.length == 2 && false) {
                return {
                    username: "",
                    userId: row[0],
                    itemId: row[1]
                };
            }
            return {
                username: row[0],
                userId: row[1],
                itemId: row[2]
            };
        });
        lastRecord = oldRecords[0];
    });
}

module.exports = loadRecordsFromCsv;