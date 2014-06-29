/*! Penelope v0.0.0 - MIT license */

'use strict';

module.exports = {
    id: 'top-child-rules',
    name: 'Top Child Rules',
    type: 'rule',
    aggregate: 'max',
    format: 'number',
    measure: function (rule, data) {
        return data.childRules.length;
    }
};