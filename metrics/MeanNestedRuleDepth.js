/*! Penelope v0.0.0 - MIT license */

'use strict';

module.exports = {
    id: 'mean-nested-rule-depth',
    name: 'Mean Nested Rule Depth',
    type: 'rule',
    aggregate: 'mean',
    format: 'number',
    measure: function (rule, data) {
        return data.parentRules.length;
    }
};