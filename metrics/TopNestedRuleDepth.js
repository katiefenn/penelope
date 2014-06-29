/*! Penelope v0.0.0 - MIT license */

'use strict';

module.exports = {
    id: 'top-nested-rule-depth',
    name: 'Top Nested Rule Depth',
    type: 'rule',
    aggregate: 'max',
    format: 'number',
    measure: function (rule, data) {
        return data.parentRules.length;
    }
};