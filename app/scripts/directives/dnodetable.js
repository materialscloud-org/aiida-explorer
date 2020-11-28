"use strict";

/**
 * @ngdoc directive
 * @name materialsCloudApp.directive:dnodeTable
 * @restrict A
 *
 * @description
 * This directive is used to display node table.
 *
 * #### File location: app/scripts/directives/dnodetable.js
 * #### Templete URL: app/views/explore/dnodetable.html
 *
 */

angular.module("materialsCloudApp").directive("dnodeTable", function () {
    return {
        templateUrl: "views/explore/dnodetable.html",
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            //element.text('this is the nodemetadata directive');
        }
    };
});
