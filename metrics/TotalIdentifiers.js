/*! Penelope v0.0.0 - MIT license */

'use strict';

var _ = require('underscore');

module.exports = {
    id: 'total-identifiers',
    name: 'Total Identifiers',
    type: 'identifier',
    aggregate: 'sum',
    measure: function (identifier) {
        return 1;
    }
};