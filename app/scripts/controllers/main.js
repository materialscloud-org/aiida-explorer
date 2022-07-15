"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:MainCtrl
 * @description
 *
 * It is the controller for main/home section in materials cloud..
 *
 * #### File location: app/scripts/controllers/main.js
 *
 * @requires $scope : scope object for this page
 *
 */
angular.module("materialsCloudApp").controller("MainCtrl",
    ["$scope", "$location", "$window",
        function ($scope, $location, $window) {

            $scope.isActive = function (path) {
                return ($location.path().substr(0, path.length) === path) ? 'active' : '';
            };

            // display maintenance message
            // note for the future, to avoid to make mistakes, that we are in +0100 in winter, +0200 during daylight saving time
            var endmaintenance = new Date("2022-07-15T22:00:00+02:00");
            var current = new Date();

            var showMaintenanceMessage = true;

            var message = "NOTE! EXPLORE might be inaccessible" +
                " from 08:00 CET of Friday July 15th" +
                " until 22:00 CET of Friday July 15th, 2022" +
                " due to maintenance work." + // at our infrastructure provider CSCS." +
                " <br>We apologize for any inconvenience.";

            if (current.getTime() < endmaintenance.getTime() && showMaintenanceMessage) {
                $(".mcloud-message-container").append('<div class="mcloud-general-message"><p>' + message + '</p></div>');
            }

            $scope.changePath = function (path) {
                $window.location.href = $window.location.origin + "/" + path;
            };
        }
    ]
);
