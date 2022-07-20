"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:CifDetailsCtrl
 * @description
 *
 * Controller for displaying CIF structures.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/data/cif.js
 *
 * @requires $scope : scope object for this page
 * @requires $window : rezise event of window object is used to resize structure
 * @requires nodeVisualization : service used to visualize structure
 * @requires $timeout : used to add delay
 * @requires CONFIG : materials cloud configuration file
 * @requires nodeService : service used to request node data from server
 *
 */

app.controller('CifDetailsCtrl',
    ["$scope", "$window", "nodeVisualization", "$timeout", "CONFIG", "nodeService", "utils",
        function ($scope, $window, nodeVisualization, $timeout, CONFIG, nodeService, utils) {

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:CifDetailsCtrl#attributes
             * @propertyOf materialsCloudApp.controller:CifDetailsCtrl
             *
             * @description
             * stores the structure attributes received from the server.
             */
            $scope.attributes = {};

            $scope.strInfo = {};

            /**
             * Toggle the interaction of structure visualizer on double click event
             */
            $scope.enableCifInteraction = true;

            $scope.toggleCifVisInteraction = function(){
                if ($scope.enableCifInteraction){
                    // enable interaction here
                    $("#str-overlay").css("display", "none");
                    $("#structure-content").css('pointer-events', 'auto');
                    $scope.enableCifInteraction = false;
                }
                else{
                    // disable interaction here
                    $("#str-overlay").css("display", "table");
                    $("#structure-content").css('pointer-events', 'none');
                    $scope.enableCifInteraction = true;
                }
            };

            $scope.structureViewer = null;
            $scope.jsmolAppletName = "";
            $scope.crystalCif = "";
            $scope.supercell = [1, 1, 1];
            $scope.selectedAxesIdx = 1;

            /**
             * Get node visualization data from the server using nodeService
             * and display structure using nodeVisualization.
             */
            nodeService.getMetadata("DATA", $scope.nodeId, "VISUALIZATION_CIF", $scope.profileRestEndPoint)
                .then(function (response) {

                    response = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["VISUALIZATION"]];

                    if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v2' || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v3') {

                        // download options
                        var base = $scope.profileRestEndPoint + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DATA"] + "/" + $scope.nodeId
                            + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DOWNLOAD"] + "?format=";
                        $scope.downloadOptions = [
                            {"name": "CIF", link: base + "cif"}
                        ];

                        // display crystal
                        if (response["str_viz_info"]["format"] == "chemdoodle") {
                            if (typeof response["str_viz_info"]["data"] === 'string' || response["str_viz_info"]["data"] instanceof String) {
                                var crystalCif = JSON.parse(response["str_viz_info"]["data"]);
                            } else {
                                var crystalCif = response["str_viz_info"]["data"];
                            }
                            // display crystal
                            $timeout(function () {
                                $scope.structureviewer = null;
                                $scope.structureviewer = nodeVisualization.chemDoodleCrystal(
                                    crystalCif, "cif", "crystal", "structure-content", $scope.structureviewer);
                                $scope.toggleCifVisInteraction();
                            });
                        } else {

                            $scope.jsmolAppletName = "jmolApplet";
                            //get metadata
                            $timeout(function () {
                                $scope.crystalCif = response["str_viz_info"]["data"];
                            });
                        }
                    } else {
                        $scope.jsmolAppletName = "jmolApplet";
                        //get metadata
                        $timeout(function () {
                            $scope.crystalCif = response["data"];
                        });
                    }
                });

            if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v4') {
             /**
             * Get cif download options from the server using nodeService.
             */
                nodeService.getDownloadFormats("DATA", $scope.profileRestEndPoint)
                    .then(function (response) {
                            response = response.data.data["data.core.cif.CifData.|"];
                            // download options
                            var base = $scope.profileRestEndPoint + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DATA"]
                                + "/" + $scope.nodeId + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DOWNLOAD"] + "?download_format=";
                            $scope.downloadOptions = [];
                            angular.forEach(response, function (value) {
                                $scope.downloadOptions.push({"name": value.toUpperCase(), link: base + value});
                            });
                    });
            }
            /**
             * Resize the structure on window resize event.
             */
            angular.element($window).bind('resize', function(){
                if ($scope.structureviewer) {
                    var parentcanvas = document.getElementById('structure-content');
                    var the_width = parentcanvas.offsetWidth -10;
                    var the_height = parentcanvas.offsetHeight -10;

                    $scope.structureviewer.resize(the_width, the_height);
                }
            });

        }
    ]
);
