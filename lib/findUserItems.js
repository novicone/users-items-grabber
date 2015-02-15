/**
 * Created by novic on 15.02.15.
 */

var cheerio = require("cheerio");

function findUsersItems(html) {
    var $ = cheerio.load(html);
    var items = [];
    $(".feedbacks-row").each(function(_, row) {
        var $row = $(row);
        var $showFeedbackLink = $row.find(".showFeedback");
        items.push({
            userName: $row.find(".uname a").text(),
            userId: $showFeedbackLink.data("userId"),
            itemId: $showFeedbackLink.data("itemId")
        });
    });
    return items;
}

module.exports = findUsersItems;