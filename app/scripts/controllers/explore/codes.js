"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:CodesCtrl
 * @description
 *
 * It is the controller to display codes table.
 *
 * #### File location: app/scripts/controllers/explore/codes.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to get the state (url) details
 * @requires $controller : to call another controller from this controller
 *
 */

angular.module("materialsCloudApp").controller("CodesCtrl", ["$scope", "$state", "$controller",
    function ($scope, $state, $controller) {

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:CodesCtrl#hasStatistics
         * @propertyOf materialsCloudApp.controller:CodesCtrl
         *
         * @description
         *  it stores the boolean value false as we are not displaying
         *  any statistics plots for codes.
         */
        $scope.hasStatistics = false;


        /**
         * Call the base contraller to display codes table.
         */
        $controller('BasenodeviewCtrl', { $scope: $scope });

    }]
);

