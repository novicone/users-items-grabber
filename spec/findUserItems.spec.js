/**
 * Created by novic on 15.02.15.
 */

var fs = require("fs");
var path = require("path");
var http = require("http");
var findUserItems = require("../lib/findUserItems");

describe("findUserItems", function() {
    it("finds items in allegro's html", function() {
        var html = fs.readFileSync(path.join(__dirname, "test.html")).toString();
        var items = findUserItems(html);
        expect(items.length).toBe(25);
    });
});