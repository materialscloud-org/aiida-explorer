'use strict';

// checking endpoints for SSSP section

describe("test suite for node ajax calls (from AiiDA REST API)", function() {
    $.ajaxSetup({
        async:false
    });

    // load the service's module
    beforeEach(module('materialsCloudApp'));

    // instantiate service
    var ENV, CONFIG, utils;

    beforeEach(inject(function (_ENV_, _CONFIG_, _utils_) {
        ENV = _ENV_;
        CONFIG = _CONFIG_;
        utils = _utils_;
    }));

    // =================== schema check =================

    it("test to check computers schema", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.COMPUTER + CONFIG.REST_API.NODE.SCHEMA;

        utils.makeTestAjaxCall(url, function(data) {
            check_schema(data);
        });
    });

    it("test to check calculations schema", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.CALCULATION + CONFIG.REST_API.NODE.SCHEMA;

        utils.makeTestAjaxCall(url, function(data) {
            check_schema(data);
        });
    });

    it("test to check data nodes schema", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.DATA + CONFIG.REST_API.NODE.SCHEMA;

        utils.makeTestAjaxCall(url, function(data) {
            check_schema(data);
        });
    });

    it("test to check codes schema", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.CODE + CONFIG.REST_API.NODE.SCHEMA;

        utils.makeTestAjaxCall(url, function(data) {
            check_schema(data);
        });
    });

    // =================== statistics check =================

    it("test to check calculations statistics", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.CALCULATION + CONFIG.REST_API.NODE.STATISTICS;

        utils.makeTestAjaxCall(url, function(data) {
            expect(data.data["ctime_by_day"]).toBeDefined();
            expect(Object.keys(data.data["ctime_by_day"]).length).toBeGreaterThan(0);

            expect(data.data.total).toBeDefined();
            expect(data.data.total).toBeGreaterThan(0);

            expect(data.data.types).toBeDefined();
            expect(Object.keys(data.data.types).length).toBeGreaterThan(0);
        });
    });

    // =================== single node check =================

    it("test to get single node", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.CALCULATION + "/77512d4a";

        utils.makeTestAjaxCall(url, function(data) {

            expect(data.data.calculations.length).toBeGreaterThan(0);

            var calc = data.data.calculations[0];
            expect(calc.attributes).toBeDefined();
            expect(calc.type).toBeDefined();
            expect(calc.ctime).toBeDefined();
            expect(calc.mtime).toBeDefined();
            expect(calc.uuid).toBeDefined();
            expect(calc["user_email"]).toBeDefined();
        });
    });

    // =================== filtered node list check =================

    it("test to get filtered nodes", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.CALCULATION + '?type="calculation.job.quantumespresso.ph.PhCalculation."';

        utils.makeTestAjaxCall(url, function(data) {

            expect(data.data.calculations.length).toBeGreaterThan(0);

            var calc = data.data.calculations[0];
            expect(calc.attributes).toBeDefined();
            expect(calc.type).toBeDefined();
            expect(calc.type).toEqual("calculation.job.quantumespresso.ph.PhCalculation.");
            expect(calc.ctime).toBeDefined();
            expect(calc.mtime).toBeDefined();
            expect(calc.uuid).toBeDefined();
            expect(calc["user_email"]).toBeDefined();
        });
    });

    // =================== node metadata: io input check =================

    it("test to get node metadata: io inputs", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.CALCULATION + "/77512d4a" + CONFIG.REST_API.NODE.INPUTS;

        utils.makeTestAjaxCall(url, function(data) {

            expect(data.data.inputs.length).toBeGreaterThan(0);

            var input = data.data.inputs[0];
            expect(input.attributes).toBeDefined();
            expect(input.type).toBeDefined();
            expect(input.ctime).toBeDefined();
            expect(input.mtime).toBeDefined();
            expect(input.uuid).toBeDefined();
            expect(input["user_email"]).toBeDefined();
        });
    });

    // =================== node metadata: io tree check =================

    it("test to get node metadata: io tree", function () {

        var ProfileRestEndPoint = ENV["exploreSsspRestEndPoint"];
        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE.CALCULATION + "/77512d4a" + CONFIG.REST_API.NODE.IO_TREE;

        utils.makeTestAjaxCall(url, function(data) {

            expect(data.data.edges.length).toBeGreaterThan(0);
            expect(data.data.nodes.length).toBeGreaterThan(0);

            var edge = data.data.edges[0];
            expect(edge.arrows).toBeDefined();
            expect(edge.color.inherit).toBeDefined();
            expect(edge.from).toBeDefined();
            expect(edge.linktype).toBeDefined();
            expect(edge.to).toBeDefined();

            var node = data.data.nodes[0];
            expect(node.description).toBeDefined();
            expect(node.displaytype).toBeDefined();
            expect(node.group).toBeDefined();
            expect(node.id).toBeDefined();
            expect(node.nodeid).toBeDefined();
            expect(node.nodetype).toBeDefined();
            expect(node.nodeuuid).toBeDefined();
            expect(node.shape).toBeDefined();
        });
    });

});

function check_schema(data) {
    // checking ordering list
    expect(data.data.ordering.length).toBeGreaterThan(0);
    expect(data.data.ordering.length).toEqual(Object.keys(data.data.fields).length);

    // check fields dictionary
    $.each(data.data.ordering, function (idx, fname) {
        var field = data.data.fields[fname];
        expect(field["display_name"]).toBeDefined();
        expect(field["help_text"]).toBeDefined();
        expect(field["is_display"]).toBeDefined();
        expect(field["is_foreign_key"]).toBeDefined();
        expect(field["type"]).toBeDefined();
    });
}
