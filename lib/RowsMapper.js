
function RowsMapper(definition) {
    this._definition = definition;
}

RowsMapper.prototype = {
    constructor: RowsMapper,
    getDefinition: function() {
        return this._definition.slice();
    },
    map: function(row) {
        if (row.length < this._definition.length) {
            throw new Error();
        }
        var obj = {};
        this._definition.forEach(function(field, i) {
            obj[field] = row[i];
        });
        return obj;
    },
    unmap: function(obj) {
        return this._definition.map(function(field) {
            if (!obj.hasOwnProperty(field)) {
                throw new Error();
            }
            return obj[field];
        });
    }
};

module.exports = RowsMapper;