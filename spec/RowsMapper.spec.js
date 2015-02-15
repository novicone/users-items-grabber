/**
 * Created by novic on 15.02.15.
 */

describe("RowsMapper", function() {
    var RowsMapper = require("../lib/RowsMapper");
    var definition = ["this", "is", "a", "mapping"];
    var mapper;

    beforeEach(function() {
        mapper = new RowsMapper(definition);
    });

    it("has a mapping definition", function() {
        expect(mapper.getDefinition()).toEqual(definition);
    });

    it("maps a row onto an object", function() {
        expect(mapper.map([1, 2, 3, 4])).toEqual({
            "this": 1,
            "is": 2,
            "a": 3,
            "mapping": 4
        });
    });

    it("unmaps an object back into a row", function() {
        expect(mapper.unmap({
            "this": 1,
            "is": 2,
            "a": 3,
            "mapping": 4
        })).toEqual([1, 2, 3, 4]);
    });

    it("throws when a row cannot be mapped", function() {
        expect(function() {
            mapper.map([1, 2, 3]);
        }).toThrow();

        expect(function() {
            mapper.map([1, 2, 3, 4, 5]);
        }).not.toThrow();
    });

    it("throws when an object cannot be unmapped", function() {
        expect(function() {
            mapper.unmap({
                "this": 1,
                "is": 2,
                "improper": 3
            });
        }).toThrow();
        expect(function() {
            mapper.unmap({
                "this": 1,
                "is": 2,
                "a": 3,
                "proper": -123,
                "mapping": 4
            });
        }).not.toThrow();
    });
});