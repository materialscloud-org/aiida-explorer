"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:CalculationsCtrl
 * @description
 *
 * It is the controller to display calculation node table.
 *
 * #### File location: app/scripts/controllers/explore/calculations.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to get the state (url) details
 * @requires $controller : to call another controller from this controller
 *
 */

angular.module("materialsCloudApp").controller("CalculationsCtrl", ["$scope", "$state", "$controller",
    function ($scope, $state, $controller) {

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:CalculationsCtrl#hasStatistics
         * @propertyOf materialsCloudApp.controller:CalculationsCtrl
         *
         * @description
         *  it stores the boolean value true to display statistics plots
         *  for calculation nodes.
         */
        $scope.hasStatistics = true;

        /**
         * Call the base contraller to display calculations table.
         */
        $controller('BasenodeviewCtrl', { $scope: $scope });

    }]
);