/*! Penelope v0.0.0 - MIT license */

'use strict';

var _ = require('underscore');

function CssRule(raw) {
    this.raw = raw;
}

CssRule.prototype.getSelectors = function () {
    return getSelectors(getSelectorBlock(this.raw));
};

CssRule.prototype.getDeclarations = function () {
    this.children = this.children || getChildren(getDeclarationBlock(this.raw));
    return this.children.filter(isDeclaration);
};

CssRule.prototype.getRules = function () {
    this.children = this.children || getChildren(getDeclarationBlock(this.raw));
    return this.children.filter(isRule);
}

var getSelectorBlock = function (rule) {
    var pattern = /([^{]+)\{/g,
        results = pattern.exec(rule);

    return results[1];
};

var getSelectors = function (selectorBlock) {
    var untrimmedSelectors = selectorBlock.split(','),
        trimmedSelectors = untrimmedSelectors.map(function (untrimmed) {
            return untrimmed.trim();
        });

    return trimmedSelectors;
};

var getDeclarationBlock = function (rule) {
    var pattern = /\{(.+)\}/g,
        results = pattern.exec(rule);

    if (_.isNull(results)) {
        return '';
    }

    return results[1];
};

var getChildren = function (declarationBlock) {
    var children = [],
        depth = 0,
        child = '';

    for (var index = 0; index < declarationBlock.length; index++) {
        var character = declarationBlock.charAt(index);
        child += character;
        if (character == '{') {
            depth++;
        }
        else if (character == '}') {
            depth--;
        }
        if (depth === 0 && declarationBlock.charAt(index).match(/\}|;/g)) {
            children.push(child.trim());
            child = '';
        }
    }

    if (child.length > 0) {
        children.push(child);
    }

    return children;
};

var isRule = function (child) {
    return child.indexOf('{') > 0;
};

var isDeclaration = function (child) {
    return !isRule(child);
}

module.exports = CssRule;