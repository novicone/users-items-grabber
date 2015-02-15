/**
 * Created by novic on 15.02.15.
 */

describe("auctionRowsToObjects", function() {
    var auctionRowsToObjects = require("../lib/auctionRowsToObjects");

    it("transforms arrays of auctions information into corresponding objects", function() {
        var rows = [[1, 2, 3], ["a", "b", "c"]];

        var parsed = auctionRowsToObjects(rows);
        expect(parsed).toEqual([{
            username: 1,
            userId: 2,
            itemId: 3
        }, {
            username: "a",
            userId: "b",
            itemId: "c"
        }]);
    });

    it("handles the old format without user names in the first column", function() {
        var rows = [[1, 2], [3, 4]];
        expect(auctionRowsToObjects(rows)).toEqual([{
            username: "",
            userId: 1,
            itemId: 2
        }, {
            username: "",
            userId: 3,
            itemId: 4
        }]);
    });
});