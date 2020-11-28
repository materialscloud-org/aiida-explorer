"use strict";

/**
 * @ngdoc directive
 * @name materialsCloudApp.directive:nodeStatistics
 * @restrict A
 *
 * @description
 * This directive is used to display node statistics.
 *
 * #### File location: app/scripts/directives/nodestatistics.js
 * #### Templete URL: app/views/explore/nodestatistics.html
 *
 */

angular.module("materialsCloudApp").directive('nodeStatistics', function () {
    return {
        templateUrl: "views/explore/nodestatistics.html",
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
        }
    };
});


