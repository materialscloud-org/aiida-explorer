"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:KpointDetailsCtrl
 * @description
 *
 * It is the controller to display kpoints details.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/data/kpoint.js
 *
 * @requires $scope : scope object for this page
 * @requires $window : rezise event of window object is used to resize BZ
 * @requires $timeout : used to add delay
 * @requires nodeService : service used to request node data from server
 * @requires CONFIG : materials cloud configuration file
 *
 */

angular.module("materialsCloudApp").controller('KpointDetailsCtrl',
    ["$scope", "$window", "$timeout", "nodeService", "CONFIG",
        function ($scope, $window, $timeout, nodeService, CONFIG) {

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:KpointDetailsCtrl#kpointsJson
             * @propertyOf materialsCloudApp.controller:KpointDetailsCtrl
             *
             * @description
             * stores the kpoints data received from the server.
             */
            $scope.kpointsJson = null;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:KpointDetailsCtrl#has_cell
             * @propertyOf materialsCloudApp.controller:KpointDetailsCtrl
             *
             * @description
             * stores the boolean to check if kpoints data has a cell?.
             */
            $scope.has_cell = null;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:KpointDetailsCtrl#has_mesh
             * @propertyOf materialsCloudApp.controller:KpointDetailsCtrl
             *
             * @description
             * stores the boolean to check if kpoints data has a hash?.
             */
            $scope.has_mesh = null;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:KpointDetailsCtrl#has_labels
             * @propertyOf materialsCloudApp.controller:KpointDetailsCtrl
             *
             * @description
             * stores the boolean to check if kpoints data has a labels?.
             */
            $scope.has_labels =null;

            /**
             * It works on:
             *  - requests the kpoints data from the server using nodeService
             *  - initialise data and flags
             *  - create windows using util function to display details
             */

            $scope.kpointsVisDataLoading = true;

            // BZ object
            $scope.mainBZVisualizer = new BZVisualizer();

            nodeService.getMetadata("DATA", $scope.nodeId, "VISUALIZATION", $scope.profileRestEndPoint)
                .then(function (response) {
                    //get metadata
                    $scope.kpointsJson = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DERIVED_PROPERTIES"]];
                    $scope.has_cell = $scope.kpointsJson.has_cell;
                    $scope.has_mesh = $scope.kpointsJson.has_mesh;
                    $scope.has_labels = $scope.kpointsJson.has_labels;

                    $scope.kpointsVisDataLoading = false;
                    $scope.$on("$includeContentLoaded", function () {
                        // if has_cell === true
                        if($scope.has_cell && $scope.hascell_loaded === undefined){
                            // to load the following only once
                            $scope.hascell_loaded = true;
                            
                            // display Brillouin-zone
                            if($scope.kpointsJson.path === undefined){
                                $scope.kpointsJson.path = [];
                            }

                            if ($scope.profileRestEndPoint.endsWith("v4")) {
                                nodeService.getMetadata("DATA", $scope.nodeId, "ATTRIBUTES", $scope.profileRestEndPoint, {"attributes_filter": "cell"})
                                    .then(function (response) {
                                        var cell = response.data.data.attributes.cell;
                                        var matrixDeterminant = cell[0][0] * cell[1][1] * cell[2][2] +
                                                                cell[1][0] * cell[2][1] * cell[0][2] +
                                                                cell[0][1] * cell[1][2] * cell[2][0] -
                                                                cell[0][2] * cell[1][1] * cell[2][0] -
                                                                cell[0][0] * cell[1][2] * cell[2][1] -
                                                                cell[0][1] * cell[1][0] * cell[2][2];
                                        var b00 = 2 * Math.PI * (cell[1][1]*cell[2][2]-cell[2][1]*cell[1][2])/matrixDeterminant;
                                        var b10 = 2 * Math.PI * (cell[2][1]*cell[0][2]-cell[0][1]*cell[2][2])/matrixDeterminant;
                                        var b20 = 2 * Math.PI * (cell[0][1]*cell[1][2]-cell[1][1]*cell[0][2])/matrixDeterminant;
                                        var b01 = 2 * Math.PI * (cell[1][2]*cell[2][0]-cell[1][0]*cell[2][2])/matrixDeterminant;
                                        var b11 = 2 * Math.PI * (cell[0][0]*cell[2][2]-cell[2][0]*cell[0][2])/matrixDeterminant;
                                        var b21 = 2 * Math.PI * (cell[1][0]*cell[0][2]-cell[0][0]*cell[1][2])/matrixDeterminant;
                                        var b02 = 2 * Math.PI * (cell[1][0]*cell[2][1]-cell[1][1]*cell[2][0])/matrixDeterminant;
                                        var b12 = 2 * Math.PI * (cell[0][1]*cell[2][0]-cell[0][0]*cell[2][1])/matrixDeterminant;
                                        var b22 = 2 * Math.PI * (cell[0][0]*cell[1][1]-cell[0][1]*cell[1][0])/matrixDeterminant;

                                        $scope.kpointsJson.b1 = [b00, b01, b02];
                                        $scope.kpointsJson.b2 = [b10, b11, b12];
                                        $scope.kpointsJson.b3 = [b20, b21, b22];

                                        $scope.reciprocalCell = [$scope.kpointsJson.b1, $scope.kpointsJson.b2, $scope.kpointsJson.b3];

                                        startWebGLCheck();
                                        try {
                                            $scope.mainBZVisualizer.loadBZ('bz-kpoints', 'info', $scope.kpointsJson);
                                        }
                                        catch(err) {
                                            console.log("Error in showing BZ: ", err);
                                        }
                                    });
                            } else {
                                $scope.reciprocalCell = [$scope.kpointsJson.b1, $scope.kpointsJson.b2, $scope.kpointsJson.b3];

                                startWebGLCheck();
                                try {
                                    $scope.mainBZVisualizer.loadBZ('bz-kpoints', 'info', $scope.kpointsJson);
                                }
                                catch(err) {
                                    console.log("Error in showing BZ: ", err);
                                }
                            }

                        }

                        // if has_mesh === true
                        if($scope.has_mesh && $scope.hasmesh_loaded === undefined){
                            // to load the following only once
                            $scope.hasmesh_loaded = true;
                            
                            $scope.meshOffset = {
                                "Mesh": [$scope.kpointsJson.mesh[0], $scope.kpointsJson.mesh[1],
                                    $scope.kpointsJson.mesh[2]],
                                "Offset": [$scope.kpointsJson.offset[0], $scope.kpointsJson.offset[1],
                                    $scope.kpointsJson.offset[2]]
                            };
                        }
                    });
                });

            /**
             * Resize the BZ on window resize event.
             */
            angular.element($window).bind('resize', function(){
                $scope.mainBZVisualizer.resizeRenderer(); // BZ visualizer
            });

        }
    ]
);