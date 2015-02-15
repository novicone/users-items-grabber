/**
 * Created by novic on 15.02.15.
 */

function auctionRowsToObjects(rows) {
    return rows.map(function(row) {
        if (row.length == 2) {
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
}

module.exports = auctionRowsToObjects;