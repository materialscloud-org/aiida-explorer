"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:ComputerDetailsCtrl
 * @description
 *
 * It is the controller used to display computer details.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/computer.js
 *
 * @requires $scope : scope object for this page
 *
 */

angular.module("materialsCloudApp").controller('ComputerDetailsCtrl',
    ["$scope",
        function ($scope) {

            $('.panel-collapse').on('show.bs.collapse', function () {
                $(this).siblings('.panel-info').addClass('active');
            });

            $('.panel-collapse').on('hide.bs.collapse', function () {
                $(this).siblings('.panel-info').removeClass('active');
            });

        }
    ]
);