"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:UpfDetailsCtrl
 * @description
 *
 * It is the controller to display upf details.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/data/upf.js
 *
 * @requires $scope : scope object for this page
 * @requires CONFIG : materials cloud configuration file
 *
 */

angular.module("materialsCloudApp").controller('UpfDetailsCtrl',
    ["$scope", "CONFIG", "nodeService",
        function ($scope, CONFIG, nodeService) {

            if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v2' || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v3') {
                $scope.downloadUrl = $scope.profileRestEndPoint
                            + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DATA"] + "/" + $scope.nodeId
                            + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DOWNLOAD"];
            } else {

             /**
             * Get upf download options from the server using nodeService.
             */
                nodeService.getDownloadFormats("DATA", $scope.profileRestEndPoint)
                    .then(function (response) {
                            response = response.data.data["data.core.upf.UpfData.|"];
                            $scope.downloadUrl = $scope.profileRestEndPoint
                                + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DATA"] + "/" + $scope.nodeId
                                + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DOWNLOAD"]
                                + "?download_format=upf";
                    });
            }
        }
    ]
);
