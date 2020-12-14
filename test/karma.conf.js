// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-11-17 using
// generator-karma 1.0.0

module.exports = function(config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        // as well as any additional frameworks (requirejs/chai/sinon/...)
        frameworks: [
            "jasmine"
        ],

        reporters: ['progress'],

        // list of files / patterns to load in the browser
        files: [
            "app/scripts/external/kendo/jquery.min.js",

            // bower:js
            'bower_components/angular/angular.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-loading-bar/build/loading-bar.js',
            'bower_components/angular-local-storage/dist/angular-local-storage.js',
            'bower_components/json-formatter/dist/json-formatter.js',
            'bower_components/d3/d3.js',
            'bower_components/jszip/dist/jszip.js',
            'bower_components/highcharts/highcharts.js',
            'bower_components/highcharts/highcharts-more.js',
            'bower_components/highcharts/modules/exporting.js',
            'bower_components/vis/dist/vis.js',
            'bower_components/angular-breadcrumb/release/angular-breadcrumb.js',
            'bower_components/cookieconsent/build/cookieconsent.min.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-material/angular-material.js',
            'bower_components/material-design-lite/material.min.js',
            'bower_components/angular-ui-router-title/angular-ui-router-title.js',
            'bower_components/oclazyload/dist/ocLazyLoad.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            'bower_components/angular-validation/dist/angular-validation.js',
            // endbower

            "app/scripts/external/kendo/kendo.ui.core.min.js",
            "app/scripts/external/ng-table.min.js",
            "app/scripts/*.js",
            "app/scripts/filters/**/*.js",
            "app/scripts/services/**/*.js",
            "app/scripts/directives/**/*.js",
            "app/scripts/controllers/**/*.js",
            //"test/mock/**/*.js",
            "test/spec/**/*.js"
        ],

        // list of files / patterns to exclude
        exclude: [
        ],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            "Chrome",
            "Firefox",
            "Safari"
        ],

        // Which plugins to enable
        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-safari-launcher",
            "karma-jasmine"
        ],

        browserConsoleLogOptions: {
            terminal: true,
            level: ""
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
