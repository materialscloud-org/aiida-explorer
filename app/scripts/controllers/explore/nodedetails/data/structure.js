"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:StructureDetailsCtrl
 * @description
 *
 * It is the controller to display structure details.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/data/structure.js
 *
 * @requires $scope : scope object for this page
 * @requires $window : rezise event of window object is used to resize structure
 * @requires nodeVisualization : service used to visualize structure
 * @requires $timeout : used to add delay
 * @requires CONFIG : materials cloud configuration file
 * @requires nodeService : service used to request node data from server
 *
 */

angular.module("materialsCloudApp").controller('StructureDetailsCtrl',
    ["$scope", "$window", "nodeVisualization", "$timeout", "CONFIG", "nodeService", "utils",
        function ($scope, $window, nodeVisualization, $timeout, CONFIG, nodeService, utils) {

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:StructureDetailsCtrl#attributes
             * @propertyOf materialsCloudApp.controller:StructureDetailsCtrl
             *
             * @description
             * stores the structure attributes received from the server.
             */
            $scope.attributes = {};

            $scope.strInfo = {};

            function getDimensionality(diminfo){
                var unit = "";
                if(diminfo.dim == 1)
                    unit = "&#8491;";
                else if (diminfo.dim > 1 && diminfo.dim < 4)
                    unit = "&#8491;<sup>" + diminfo.dim + "</sup>";

                $scope.strInfo.unit = unit;
                $scope.strInfo.dimensionality = diminfo.dim + "D";
                $scope.strInfo.label = diminfo.label;
                $scope.strInfo.value = diminfo.value;
            }

            /**
             * Toggle the interaction of structure visualizer on double click event
             */
            $scope.enableStrInteraction = true;

            $scope.toggleStrVisInteraction = function(){
                if ($scope.enableStrInteraction){
                    // enable interaction here
                    $("#str-overlay").css("display", "none");
                    $("#crystal").css('pointer-events', 'auto');
                    $scope.enableStrInteraction = false;
                }
                else {
                    // disable interaction here
                    $("#str-overlay").css("display", "table");
                    $("#crystal").css('pointer-events', 'none');
                    $scope.enableStrInteraction = true;
                }
            };

            $scope.structureViewer = null;
            $scope.jsmolAppletName = "";
            $scope.crystalXsf = "";
            $scope.supercell = [1, 1, 1];
            $scope.selectedAxesIdx = 0;

            /**
             * Get node visualization data from the server using nodeService
             * and display structure using nodeVisualization.
             */
            nodeService.getMetadata("DATA", $scope.nodeId, "VISUALIZATION_XSF", $scope.profileRestEndPoint)
                .then(function (response) {

                    response = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["VISUALIZATION"]];

                    $scope.structureviewer = null;
                    if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v2' || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v3') {

                        // download options
                        var base = $scope.profileRestEndPoint + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DATA"]
                            + "/" + $scope.nodeId + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DOWNLOAD"] + "?format=";
                        $scope.downloadOptions = [
                            {"name": "CIF", link: base + "cif"},
                            {"name": "XYZ", link: base + "xyz"},
                            {"name": "XSF", link: base + "xsf"}
                        ];

                        $scope.strInfo.formula = utils.getCompoundNamesWithSubscripts(response.formula);
                        $scope.strInfo.pbc = response.pbc;
                        getDimensionality(response.dimensionality);

                        if (response["str_viz_info"]["format"] == "chemdoodle") {
                            //get metadata
                            if (typeof response["str_viz_info"]["data"] === 'string' || response["str_viz_info"]["data"] instanceof String) {
                                var crystalJson = JSON.parse(response["str_viz_info"]["data"]);
                            } else {
                                var crystalJson = response["str_viz_info"]["data"];
                            }

                            // display crystal
                            $timeout(function () {
                                $scope.structureviewer = nodeVisualization.chemDoodleCrystal(
                                    crystalJson, "json", "crystal", "structure-content", $scope.structureviewer);
                                $scope.toggleStrVisInteraction();
                            });
                        } else {

                            $scope.jsmolAppletName = "jmolApplet";
                            //get metadata
                            $timeout(function () {
                                $scope.crystalXsf = response["str_viz_info"]["data"];
                            });
                        }
                    } else {
                            $scope.jsmolAppletName = "jmolApplet";
                            //get metadata
                            $timeout(function () {
                                $scope.crystalXsf = response["data"];
                            });
                    }
                });

            if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v4') {

            /**
             * Get structure derived properties from the server using nodeService.
             */
                nodeService.getMetadata("DATA", $scope.nodeId, "VISUALIZATION", $scope.profileRestEndPoint)
                    .then(function (response) {
                        response = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DERIVED_PROPERTIES"]];

                        $scope.strInfo.formula = utils.getCompoundNamesWithSubscripts(response.formula);
                        getDimensionality(response.dimensionality);
                    });

             /**
             * Get structure download options from the server using nodeService.
             */
                nodeService.getDownloadFormats("DATA", $scope.profileRestEndPoint)
                    .then(function (response) {
                            response = response.data.data['data.structure.StructureData.|'];
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
             * Get structure attributes from the server using nodeService.
             */
            nodeService.getMetadata("DATA", $scope.nodeId, "ATTRIBUTES", $scope.profileRestEndPoint)
                .then(function (response) {
                    //get metadata
                    $scope.attributes = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["ATTRIBUTES"]];
                    $scope.strInfo.pbc = [$scope.attributes.pbc1, $scope.attributes.pbc2, $scope.attributes.pbc3];
                });

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
