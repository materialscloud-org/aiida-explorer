"use strict";

/**
 * @ngdoc directive
 * @name materialsCloudApp.directive:bindHtmlCompile
 * @restrict A
 *
 * @description
 * bind-html-compile is not a standard Angular directive, it
 * comes with the module https://github.com/incuna/angular-bind-html-compile
 * and it is used to compile binded data. In simple terms, it is equivalent
 * to write html in the source code: it will be re-evaluated and if other
 * directories are found, they will work as expected.
 *
 * #### File location: app/scripts/directives/bindHtmlCompile.js
 *
 */

angular.module("materialsCloudApp").directive('bindHtmlCompile', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.bindHtmlCompile);
            }, function (value) {
                // Incase value is a TrustedValueHolderType, sometimes it
                // needs to be explicitly called into a string in order to
                // get the HTML string.
                element.html(value && value.toString());
                // If scope is provided use it, otherwise use parent scope
                var compileScope = scope;
                if (attrs.bindHtmlScope) {
                    compileScope = scope.$eval(attrs.bindHtmlScope);
                }
                $compile(element.contents())(compileScope);
            });
        }
    };
}])
    .directive('compile', ['$compile', function ($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);
