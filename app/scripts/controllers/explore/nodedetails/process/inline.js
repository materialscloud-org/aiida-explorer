"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:InlineDetailsCtrl
 * @description
 *
 * It is the default controller to display details of any type of the calculation
 * if dedicated controller is not available for that calculation type.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/process/inine.js
 *
 * @requires $scope : scope object for this page
 * @requires $timeout : used to add delay
 *
 */

angular.module("materialsCloudApp").controller('InlineDetailsCtrl',
    ["$scope", "$timeout", "$mdDialog", "CONFIG", "nodeService", "messageService",
        function ($scope, $timeout, $mdDialog, CONFIG, nodeService, messageService) {

            $scope.displaySourcefile = false;
            $scope.displayLastjob = false;

            /**
             * It creates the windows to display node attributes and node source file.
             */
            $timeout(function () {

                if($scope.nodeAttributes.last_jobinfo !== undefined) {
                    $scope.displayLastjob = true;
                    $scope.lastjob = angular.fromJson($scope.nodeAttributes.last_jobinfo);
                }

                if($scope.nodeAttributes.source_file !== undefined)
                    $scope.sourcefile = $scope.nodeAttributes.source_file;
                else if($scope.nodeAttributes.source_code !== undefined)
                    $scope.sourcefile = $scope.nodeAttributes.source_code;
                else {
                    var paramsDict = {"filename": "source_file"};
                    nodeService.getMetadata("CALCULATION", $scope.nodeId, "REPO_CONTENTS", $scope.profileRestEndPoint, paramsDict)
                        .then(function (response) {
                                $scope.sourcefile = response.data;
                            },
                            // handle error
                            function (response) {
                                $scope.sourcefile = "Source file/code is not available!";
                            }
                        );
                }

                $scope.displaySourcefile = true;

            });
        }
    ]
);