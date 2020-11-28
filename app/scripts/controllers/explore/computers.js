"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:ComputersCtrl
 * @description
 *
 * It is the controller to display computers table.
 *
 * #### File location: app/scripts/controllers/explore/computers.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to get the state (url) details
 * @requires $controller : to call another controller from this controller
 *
 */

angular.module("materialsCloudApp").controller("ComputersCtrl", ["$scope", "$state", "$controller",
    function ($scope, $state, $controller) {

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:ComputersCtrl#hasStatistics
         * @propertyOf materialsCloudApp.controller:ComputersCtrl
         *
         * @description
         *  it stores the boolean value false as we are not displaying
         *  any statistics plots for computers.
         */
        $scope.hasStatistics = false;


        /**
         * Call the base contraller to display computers table.
         */
        $controller('BasenodeviewCtrl', { $scope: $scope });

    }]
);