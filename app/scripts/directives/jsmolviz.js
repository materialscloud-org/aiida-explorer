"use strict";

/**
 * @ngdoc directive
 * @name materialsCloudApp.directive:JsmolViz
 * @restrict A
 *
 * @description
 * structure visualizer with JSMOL library
 *
 * #### File location: app/scripts/directives/jsmolvis.js
 *
 */

angular.module("materialsCloudApp").directive('jsmolViz', function () {
    return {
        templateUrl: "views/explore/jsmolviz.html",
        restrict: 'A',
        scope: {
            "crystalXsf": "=",
            "structureViewer": "=",
            "jsmolAppletName": "=",
            "supercell": "=",
            "divId": "@",
            "parentDivId": "@",
            "toggleStrVisInteraction": "&",
            "downloadOptions": "=",
            "selectedAxesIdx": "="
        },
        controller: ["$scope", "nodeVisualization", "$timeout",

            function($scope, nodeVisualization, $timeout) {

                $scope.$watch('crystalXsf', function(newValue, oldValue) {
                    if(newValue) {

                        var cellLine = "; unitcell 2";

                        $scope.jsmolVis2d = {
                            viewer: $scope.jsmolAppletName,
                            bonds : true,
                            packed : true,
                            rotation: false,
                            labels: false,
                            spheres: false,
                            nx: $scope.supercell[0],
                            ny: $scope.supercell[1],
                            nz: $scope.supercell[2]
                        };


                        $scope.toggleRotation = function(visualizer) {
                            if (visualizer.rotation) {
                                var jmolscript = "spin on";
                            } else {
                                var jmolscript = "spin off";
                            }
                            Jmol.script(eval(visualizer.viewer), jmolscript);
                            return jmolscript;
                        };


                        $scope.showBonds = function(visualizer) {
                            if (visualizer.bonds) {
                                var jmolscript = "wireframe 0.15";
                            } else {
                                var jmolscript = "wireframe off";
                            }
                            Jmol.script(eval(visualizer.viewer), jmolscript);
                            return jmolscript;
                        };


                        $scope.showPacked = function(visualizer, axesModel) {
                            if (visualizer.packed) {
                                var jmolscript = "save orientation 0; load '' {" + visualizer.nx + " " + visualizer.ny + " " + visualizer.nz + "} packed; unitcell primitive; restore orientation 0" + $scope.jsmolDrawAxes(visualizer, axesModel) + cellLine + "; " + $scope.showLabels(visualizer) + "; " + $scope.showBonds(visualizer);
                            } else {
                                var jmolscript = "save orientation 0; load '' {" + visualizer.nx + " " + visualizer.ny + " " + visualizer.nz + "}; unitcell primitive; restore orientation 0" + $scope.jsmolDrawAxes(visualizer, axesModel) + cellLine + "; " + $scope.showLabels(visualizer) + "; " + $scope.showBonds(visualizer);
                            }
                            visualizer.rotation = false;
                            visualizer.spheres = false;
                            Jmol.script(eval(visualizer.viewer), jmolscript);
                            return jmolscript;
                        };


                        $scope.showLabels = function(visualizer) {
                            if (visualizer.labels) {
                                var jmolscript = "label %a";
                            } else {
                                var jmolscript = "label off";
                            }
                            Jmol.script(eval(visualizer.viewer), jmolscript);
                            return jmolscript;
                        };

                        $scope.showSpheres = function(visualizer) {
                            if (visualizer.spheres) {
                                var jmolscript = "spacefill on";
                            } else {
                                var jmolscript = "spacefill 23%";
                            }
                            Jmol.script(eval(visualizer.viewer), jmolscript);
                            return jmolscript;
                        };

                        $scope.bondsTooltip = "Show bonds";
                        $scope.spheresTooltip = "Show atoms as spheres";
                        $scope.labelsTooltip = "Display element symbols";
                        $scope.packedTooltip = "Show atoms on the edge of the cell or supercell";

                        $scope.jsmolAxes = [{
                            id: "xyz",
                            label: "xyz axes",
                            value: "xyz"
                        }, {
                            id: "abc",
                            label: "abc vectors",
                            value: "abc"
                        }, {
                            id: "noaxes",
                            label: "no axes",
                            value: "noaxes"
                        }];

                        $scope.selectedAxes = $scope.jsmolAxes[$scope.selectedAxesIdx];

                        $scope.jsmolDrawAxes = function(visualizer, axesModel) {

                            switch (axesModel.value){
                                case "xyz":
                                    var jmolscript = "; axes off; draw xaxis '>X' vector {0 0 0} {2 0 0} color red width 0.15; draw yaxis '>Y' vector {0 0 0} {0 2 0} color green width 0.15; draw zaxis '>Z' vector {0 0 0} {0 0 2} color blue width 0.15";
                                    break;
                                case "abc":
                                    var jmolscript = "; draw xaxis delete; draw yaxis delete; draw zaxis delete; set axesMode 2; axes 5";
                                    break;
                                case "noaxes":
                                    var jmolscript = "; draw xaxis delete; draw yaxis delete; draw zaxis delete; axes off";
                            }
                            Jmol.script(eval(visualizer.viewer), jmolscript);
                            return jmolscript;
                        };

                        /**
                         *  It updates the supercell visualized by JSmol library.
                         */
                        $scope.jsmolSupercell = function(visualizer, axesModel) {

                            visualizer.rotation = $scope.jsmolVis2d.rotation;
                            visualizer.spheres = $scope.jsmolVis2d.spheres;
                            visualizer.packed = $scope.jsmolVis2d.packed;
                            var jmolscript = "save orientation 0; load '' {" + visualizer.nx + " " + visualizer.ny + " " + visualizer.nz + "}; unitcell primitive; restore orientation 0" + $scope.jsmolDrawAxes(visualizer, axesModel) + cellLine + "; " + $scope.showLabels(visualizer) + "; " + $scope.showBonds(visualizer) + "; " + $scope.showPacked(visualizer, axesModel) ;
                            Jmol.script(eval(visualizer.viewer), jmolscript);
                        };

                        /**
                         *  It resets the supercell visualized by JSmol library to a 2x2x2 cell.
                         */
                        $scope.jsmoldefaultcell = function(visualizer, axesModel) {
                            visualizer.rotation = $scope.jsmolVis2d.rotation;
                            visualizer.spheres = $scope.jsmolVis2d.spheres;
                            visualizer.packed = $scope.jsmolVis2d.packed;
                            // reset nx, ny, nz to 2,2,2
                            visualizer.nx = $scope.supercell[0];
                            visualizer.ny = $scope.supercell[1];
                            visualizer.nz = $scope.supercell[2];
                            Jmol.script(eval(visualizer.viewer), "save orientation 0; load '' {"+ $scope.supercell[0] + " " + $scope.supercell[1] + " " + $scope.supercell[2] +"}; unitcell primitive; restore orientation 0" + $scope.jsmolDrawAxes(visualizer, axesModel) + cellLine + "; " + $scope.showLabels(visualizer) + "; " + $scope.showBonds(visualizer) + "; " + $scope.showPacked(visualizer, axesModel));
                        };


                        /**
                         *  It resets the supercell visualized by JSmol library to a 1x1x1 cell.
                         */
                        $scope.jsmolUnitcell = function(visualizer, axesModel) {
                            visualizer.rotation = $scope.jsmolVis2d.rotation;
                            visualizer.spheres = $scope.jsmolVis2d.spheres;
                            visualizer.packed = $scope.jsmolVis2d.packed;
                            // reset nx, ny, nz to 1,1,1
                            visualizer.nx = 1;
                            visualizer.ny = 1;
                            visualizer.nz = 1;
                            Jmol.script(eval(visualizer.viewer), "save orientation 0; load ''; unitcell primitive; restore orientation 0" + $scope.jsmolDrawAxes(visualizer, axesModel) + cellLine + "; " + $scope.showLabels(visualizer) + "; " + $scope.showBonds(visualizer));
                        };


                        $scope.centerXaxis = function(visualizer){
                            Jmol.script(eval(visualizer.viewer), "moveto 1 axis x");
                        };

                        $scope.centerYaxis = function(visualizer){
                            Jmol.script(eval(visualizer.viewer), "moveto 1 axis y");
                        };

                        $scope.centerZaxis = function(visualizer){
                            Jmol.script(eval(visualizer.viewer), "moveto 1 axis z");
                        };

                        // display crystal
                        $timeout(function () {
                            $scope.structureViewerHtml = null;
                            $scope.structureViewer = nodeVisualization.jsmolCrystal($scope.crystalXsf, $scope.parentDivId, $scope.jsmolAppletName, $scope.supercell);
                            $scope.structureViewerHtml = Jmol.getAppletHtml($scope.structureViewer);
                            $scope.jsmolDrawAxes($scope.jsmolVis2d, $scope.selectedAxes);
                        }, true);
                    }
                });
            }
        ],

        link: function postLink(scope, element, attrs) {

        }
    };
});

