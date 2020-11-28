"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:WorkchainDetailsCtrl
 * @description
 *
 * It is the default controller to display details of any type of the calculation
 * if dedicated controller is not available for that calculation type.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/process/workchain.js
 *
 * @requires $scope : scope object for this page
 * @requires $timeout : used to add delay
 *
 */

angular.module("materialsCloudApp").controller('WorkchainDetailsCtrl',
    ["$scope", "$timeout", "$mdDialog", "CONFIG", "nodeService", "messageService",
        function ($scope, $timeout, $mdDialog, CONFIG, nodeService, messageService) {

            $scope.mainMetadata = [
                {"key": "process_label", "display_name": "Process label"},
                {"key": "process_state", "display_name": "Process state"},
                {"key": "exit_status", "display_name": "Exit status"},
            ];
            $scope.mainMetadataKeys = [];
            $.each($scope.mainMetadata, function(idx, info){
                $scope.mainMetadataKeys.push(info.key);
            });

        }
    ]
);