"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:DatanodesCtrl
 * @description
 *
 * It is the controller to display data node table.
 *
 * #### File location: app/scripts/controllers/explore/datanodes.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to get the state (url) details
 * @requires $controller : to call another controller from this controller
 *
 */

angular.module("materialsCloudApp").controller("DatanodesCtrl", ["$scope", "$state", "$controller",
    function ($scope, $state, $controller) {

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:DatanodesCtrl#hasStatistics
         * @propertyOf materialsCloudApp.controller:DatanodesCtrl
         *
         * @description
         *  it stores the boolean value true to display statistics plots
         *  for data nodes.
         */
        $scope.hasStatistics = true;

        /**
         * Call the base contraller to display data node table.
         */
        $controller('BasenodeviewCtrl', { $scope: $scope });

    }]
);
