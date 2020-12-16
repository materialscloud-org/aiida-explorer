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
            var isDarkThemeKey = 'isDarkTheme';
            var isDarkTheme = localStorage.getItem(isDarkThemeKey);

            if (isDarkTheme) {
                document.body.classList.toggle('dark-theme');
            }

            $scope.isActive = function (path) {
                return ($location.path().substr(0, path.length) === path) ? 'active' : '';
            };

            // display maintenance message
            // note for the future, to avoid to make mistakes, that we are in +0100 in winter, +0200 during daylight saving time
            var endmaintenance = new Date("2020-05-13T20:00:00+02:00");
            var current = new Date();

            var showMaintenanceMessage = true;

            var message = "NOTE! Materials Cloud might be inaccessible on Wednesday, May 13th, 2020" +
                " from 7 AM until 8 PM CET" +
                " due to maintenance work at our infrastructure provider CSCS." +
                " <br>We apologize for any inconvenience.";

            if (current.getTime() < endmaintenance.getTime() && showMaintenanceMessage) {
                $(".mcloud-message-container").append('<div class="mcloud-general-message"><p>' + message + '</p></div>');
            }

            $scope.changePath = function (path) {
                $window.location.href = $window.location.origin + "/" + path;
            };

            $scope.toggleTheme = function () {
                isDarkTheme = localStorage.getItem(isDarkThemeKey);
                localStorage.setItem(isDarkThemeKey, !isDarkTheme);
                document.body.classList.toggle('dark-theme');
            };
        }
    ]
);
