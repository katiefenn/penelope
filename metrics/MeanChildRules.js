/*! Penelope v0.0.0 - MIT license */

'use strict';

module.exports = {
    id: 'mean-child-rules',
    name: 'Mean Child Rules',
    type: 'rule',
    aggregate: 'mean',
    format: 'number',
    measure: function (rule, data) {
        return data.childRules.length;
    }
};