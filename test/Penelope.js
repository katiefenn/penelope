/*! Penelope v0.0.0 - MIT license */

var expect = require('chai').expect,
    Penelope = require('../lib/Penelope.js');

describe('The Penelope tool', function() {
    it('should throw an Penelope if stylesheet data not supplied as string, array or multi-param strings', function() {
        penelope = new Penelope([]);
        expect(function() {penelope.run({})}).to.throw();
        expect(function() {penelope.run(0)}).to.throw();
        expect(function() {penelope.run(1, [], {})}).to.throw();
    });

    it('should not throw an exception if stylesheet data is supplied as string, array or multi-param strings', function() {
        penelope = new Penelope([]);
        expect(function() {penelope.run('body {background: #FFF;}')});
        expect(function() {penelope.run(array('body {background: #FFF;}'))});
        expect(function() {penelope.run('body {background: #FFF;}', 'body {background: #FFF;}')});
    });

    it('should run metrics on stylesheets', function() {
        var mockMetric = {id: 'mock-stylesheet-metric', type: 'stylesheet', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]);
        expect(penelope.run('body {background: #FFF;}')).to.have.property('mock-stylesheet-metric');
    });

    it('should return sum values for sum metrics', function() {
        var mockMetric = {id: 'mock-stylesheet-metric', type: 'stylesheet', aggregate: 'sum', measure: function() {return 1}},
            stylesheet = 'body {background: #FFF;}';

        penelope = new Penelope([mockMetric]);
        var report = penelope.run([stylesheet, stylesheet, stylesheet]);

        
        expect(report).to.have.property('mock-stylesheet-metric');
        expect(report['mock-stylesheet-metric']).to.equal(3);
    });

    it('should return 0 for sum metrics with no data to report on', function() {
        var mockMetric = {id: 'mock-stylesheet-metric', type: 'rule', aggregate: 'sum', measure: function() {return 1}},
            stylesheet = '/* comment */';

        penelope = new Penelope([mockMetric]);
        var report = penelope.run([stylesheet, stylesheet, stylesheet]);


        expect(report).to.have.property('mock-stylesheet-metric');
        expect(report['mock-stylesheet-metric']).to.equal(0);
    });

    it('should return mean values for mean metrics', function() {
        var mockMetric = {id: 'mock-stylesheet-metric', type: 'stylesheet', aggregate: 'mean', measure: function() {return 1}},
            stylesheet = 'body {background: #FFF;}';

        penelope = new Penelope([mockMetric]);
        var report = penelope.run([stylesheet, stylesheet, stylesheet]);

        
        expect(report).to.have.property('mock-stylesheet-metric');
        expect(report['mock-stylesheet-metric']).to.equal(1);
    });

    it('should return 0 for mean metrics with no data to report on', function () {
        var mockMetric = {id: 'mock-stylesheet-metric', type: 'rule', aggregate: 'mean', measure: function() {return 1}},
            stylesheet = '/* comment */';

        penelope = new Penelope([mockMetric]);
        var report = penelope.run([stylesheet]);


        expect(report).to.have.property('mock-stylesheet-metric');
        expect(report['mock-stylesheet-metric']).to.equal(0);
    });

    it('should return max values for max metrics', function () {
        var mockIntMetric = {id: 'mock-int-metric', type: 'stylesheet', aggregate: 'max', measure: function(stylesheet) {return stylesheet.length;}},
            penelope = new Penelope([mockIntMetric]),
            report = penelope.run(['body {background: #FFF;}', 'body {background: #FFFFFF;}']);

        expect(report).to.have.property('mock-int-metric');
        expect(report['mock-int-metric']).to.equal(27);
    });

    it('should return 0 for max metrics with no data to report on', function () {
        var mockIntMetric = {id: 'mock-int-metric', type: 'rule', aggregate: 'max', measure: function(stylesheet) {return stylesheet.length;}},
            penelope = new Penelope([mockIntMetric]),
            report = penelope.run(['/* comment */']);

        expect(report).to.have.property('mock-int-metric');
        expect(report['mock-int-metric']).to.equal(0);
    });

    it('should return max values determined by an iterator function if one is present', function() {
        var mockStringMetric = {id: 'mock-string-metric', type: 'stylesheet', aggregate: 'max', measure: function(stylesheet) {return stylesheet;}, iterator: function(string) {return string.length}},
            penelope = new Penelope([mockStringMetric]),
            report = penelope.run(['body {background: #FFF;}', 'body {background: #FFFFFF;}']);
        
        expect(report).to.have.property('mock-string-metric');
        expect(report['mock-string-metric']).to.equal('body {background: #FFFFFF;}');
    });

    it('should return list values for list metrics', function () {
        var mockSingleMetric = {id: 'mock-single-list-item-metric', type: 'stylesheet', aggregate: 'list', measure: function(stylesheet) {return stylesheet}},
            mockMultipleMetric = {id: 'mock-multiple-list-item-metric', type: 'stylesheet', aggregate: 'list', measure: function(stylesheet) {return ['a', 'b']}},
            penelope = new Penelope([mockSingleMetric, mockMultipleMetric]),
            report = penelope.run(['body {background: #FFF;}', 'body {background: #FFF;}']);

        expect(report).to.have.property('mock-single-list-item-metric');
        expect(report['mock-single-list-item-metric']).to.be.an('array');
        expect(report['mock-single-list-item-metric']).to.have.length(2);
        expect(report['mock-single-list-item-metric'][0]).to.equal('body {background: #FFF;}');
        expect(report['mock-single-list-item-metric'][1]).to.equal('body {background: #FFF;}');
        expect(report['mock-multiple-list-item-metric']).to.be.an('array');
        expect(report['mock-multiple-list-item-metric']).to.have.length(4);
        expect(report['mock-multiple-list-item-metric'][0]).to.equal('a');
        expect(report['mock-multiple-list-item-metric'][1]).to.equal('b');
        expect(report['mock-multiple-list-item-metric'][0]).to.equal('a');
        expect(report['mock-multiple-list-item-metric'][1]).to.equal('b');
    });

    it('should return list values filtered by a filter function if one is present', function() {
        var mockMetric = {id: 'mock-list-metric', type: 'stylesheet', aggregate: 'list', measure: function(stylesheet) {return stylesheet}, filter: function(value, index, self) {return self.indexOf(value) === index;}},
            penelope = new Penelope([mockMetric]),
            report = penelope.run(['body {background: #FFF;}', 'body {background: #FFF;}']);

        expect(report).to.have.property('mock-list-metric');
        expect(report['mock-list-metric']).to.be.an('array');
        expect(report['mock-list-metric']).to.have.length(1);
        expect(report['mock-list-metric']).to.include('body {background: #FFF;}');
    });

    it('should return length values for length metrics', function () {
        var mockMetric = {id: 'mock-length-metric', type: 'stylesheet', aggregate: 'length', measure: function(stylesheet) {return stylesheet}},
        penelope = new Penelope([mockMetric]);
        report = penelope.run(['body {background: #FFF;}', 'body {background: #FFF;}', '']);

        expect(report).to.have.property('mock-length-metric');
        expect(report['mock-length-metric']).to.equal(2);
    });

    it('should run metrics on rules', function() {
        var mockMetric = {id: 'mock-rule-metric', type: 'rule', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]),
        report = penelope.run('body {background: #FFF;} h1 {font-weight: bold;}');

        expect(report).to.have.property('mock-rule-metric');
        expect(report['mock-rule-metric']).to.equal(2);
    });

    it('should run metrics on nested rules', function () {
        var mockMetric = {id: 'mock-rule-metric', type: 'rule', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]);
        report = penelope.run('body {background: #FFF;} ul { padding: 30px; li { float: left;}}');

        expect(report['mock-rule-metric']).to.equal(3);
    });

    it('should pass parent rule data to rule metrics', function () {
        var mockMetric = {id: 'mock-rule-metric', type: 'rule', aggregate: 'list', measure: function(rule, data) {return data.parentRules;}};
        penelope = new Penelope([mockMetric]);
        report = penelope.run('body {background: #FFF; ul {padding: 30px; li {float: left;}}}');

        expect(report['mock-rule-metric']).to.include('body {background: #FFF; ul {padding: 30px; li {float: left;}}}');
        expect(report['mock-rule-metric']).to.include('ul {padding: 30px; li {float: left;}}');
    });

    it('should pass child rule data to rule metrics', function () {
        var mockMetric = {id: 'mock-rule-metric', type: 'rule', aggregate: 'list', measure: function(rule, data) {return data.childRules;}};
        penelope = new Penelope([mockMetric]);

        report = penelope.run('body {background: #FFF;}');
        expect(report['mock-rule-metric']).to.have.length(0);

        report = penelope.run('body {background: #FFF; ul {padding: 30px;} li {float: left;}}');
        expect(report['mock-rule-metric']).to.include('ul {padding: 30px;}');
        expect(report['mock-rule-metric']).to.include('li {float: left;}');
    });

    it('should run metrics on media queries', function () {
        var mockMetric = {id: 'mock-media-query-metric', type: 'mediaquery', aggregate: 'list', measure: function(query) {return query;}};
            penelope = new Penelope([mockMetric]),
            report = penelope.run('@media handheld, (max-width: 700px) { body { margin: 100px; }} @import url(css/styles.css); body { margin: 0; }');
        expect(report).to.have.property('mock-media-query-metric');
        expect(report['mock-media-query-metric']).to.include('handheld');
        expect(report['mock-media-query-metric']).to.include('(max-width: 700px)');
    });

    it('should run metrics on rules inside media query blocks', function () {
        var mockMetric = {id: 'mock-media-query-metric', type: 'rule', aggregate: 'list', measure: function(rule) {return rule;}},
        penelope = new Penelope([mockMetric]),
        report = penelope.run('@media print {a {color: #000;} header {display: none;}}');
        expect(report).to.have.property('mock-media-query-metric');
        expect(report['mock-media-query-metric']).to.include('a {color: #000;}');
        expect(report['mock-media-query-metric']).to.include('header {display: none;}');
    });

    it('should run metrics on selectors', function() {
        var mockMetric = {id: 'mock-selector-metric', type: 'selector', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]);
        report = penelope.run('body section {background: #FFF;} h1 {font-weight: bold;}');

        expect(report).to.have.property('mock-selector-metric');
        expect(report['mock-selector-metric']).to.equal(2);
    });

    it('should run metrics on identifiers', function() {
        var mockMetric = {id: 'mock-identifier-metric', type: 'identifier', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]);

        report = penelope.run("body section :first-child {background: #FFF;} form#registration-form > input.username {font-weight: bold;}");
        expect(report).to.have.property('mock-identifier-metric');
        expect(report['mock-identifier-metric']).to.equal(7);
    });

    it('should run metrics on declarations', function() {
        var mockMetric = {id: 'mock-declaration-metric', type: 'declaration', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]);

        report = penelope.run("body {margin: 0; padding: 0} a {color: #00f} h1 {font-weight: bold; color: #000;}");
        expect(report).to.have.property('mock-declaration-metric');
        expect(report['mock-declaration-metric']).to.equal(5);
    });

    it('should run metrics on properties', function() {
        var mockMetric = {id: 'mock-property-metric', type: 'property', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]);

        report = penelope.run("body {margin: 0; padding: 0} a {color: #00f} h1 {font-weight: bold; color: #000;}");
        expect(report).to.have.property('mock-property-metric');
        expect(report['mock-property-metric']).to.equal(5);
    });

    it('should run metrics on values', function() {
        var mockMetric = {id: 'mock-value-metric', type: 'value', aggregate: 'sum', measure: function() {return 1}};
        penelope = new Penelope([mockMetric]);

        report = penelope.run("body {margin: 0; padding: 0} a {color: #00f} h1 {font-weight: bold; color: #000;}");
        expect(report).to.have.property('mock-value-metric');
        expect(report['mock-value-metric']).to.equal(5);
    });

    it('should return results for metrics measuring optional elements when those elements are not found', function () {
        var mockMetric = {id: 'mock-media-query-metric', type: 'mediaquery', aggregate: 'length', measure: function(query) {return query;}};
            penelope = new Penelope([mockMetric]),
            report = penelope.run('body { margin: 0; }');

        expect(report).to.have.property('mock-media-query-metric');
        expect(report['mock-media-query-metric']).to.equal(0);
    });
});