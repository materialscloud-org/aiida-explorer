"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:BandDetailsCtrl
 * @description
 *
 * It is the controller to display band details.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/data/band.js
 *
 * @requires $scope : scope object for this page
 * @requires $window : rezise event of window object is used to resize band graph
 * @requires $timeout : used to add delay
 * @requires CONFIG : materials cloud configuration file
 * @requires nodeService : service used to request node data from server
 *
 */

angular.module("materialsCloudApp").controller('BandDetailsCtrl',
    ["$scope", "$window", "$timeout", "CONFIG", "nodeService",
        function ($scope, $window, $timeout, CONFIG, nodeService) {

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:BandDetailsCtrl#bandInfo
             * @propertyOf materialsCloudApp.controller:BandDetailsCtrl
             *
             * @description
             * stores the band graph information.
             */
            $scope.bandInfo = {};
            $scope.bandVisDataLoading = true;

            /**
             * Get the band data from the server using nodeService and
             * display band graph.
             */
            nodeService.getMetadata("DATA", $scope.nodeId, "VISUALIZATION_JSON", $scope.profileRestEndPoint)
                .then(function (response) {

                    $scope.bandVisDataLoading = false;

                    //get metadata
                    $scope.bandInfo.jsondata = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["VISUALIZATION"]];
                    if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v4')
                        $scope.bandInfo.jsondata = JSON.parse($scope.bandInfo.jsondata.data);

                    // display band graph
                    $timeout(function () {

                        $scope.bandInfo.yLimits = getYLimits($scope.bandInfo.jsondata.paths);

                        var theBandPlot = new BandPlot("band", null, {ymin: $scope.bandInfo.yLimits.ymin - 1, ymax: $scope.bandInfo.yLimits.ymax + 1});

                        theBandPlot.addBandStructure($scope.bandInfo.jsondata);

                        theBandPlot.updateBandPlot();

                        var theTextBox = document.getElementById('bandPathTextBox');
                        theTextBox.value = getPathStringFromPathArray(theBandPlot.getDefaultPath());

                        var helperString = "Use - to define a segment<br>Use | to split the path.<br>Valid point names:<br>";
                        var validPoints = getValidPointNames(theBandPlot.allData);
                        helperString += validPoints.join(', ');

                        $(theTextBox).data('bs.tooltip', false).tooltip({title: helperString, html: true})
                            .tooltip('show'); // Open the tooltip


                        $scope.bandInfo.plotObj = theBandPlot;
                    });


                    function getYLimits(data){

                        var ymin, ymax, currentMin, currentMax, segmentValues, tmp;

                        $.each(data, function (segmentIdx, segment) {
                            segmentValues = segment.values;
                            $.each(segmentValues, function (bandIdx, band) {

                                // substract fermi energy
                                if($scope.fermiEnergy){
                                    tmp = band.map( function(value) {
                                        return value - $scope.fermiEnergy;
                                    } );
                                    band = tmp;
                                }

                                currentMin = Math.min.apply(Math, band);
                                currentMax = Math.max.apply(Math, band);

                                if (ymin === undefined)
                                    ymin = currentMin;
                                else if (ymin > currentMin)
                                    ymin = currentMin;

                                if (ymax === undefined)
                                    ymax = currentMax;
                                else if (ymax < currentMax)
                                    ymax = currentMax;
                            });
                        });

                        return { ymin: Math.round(ymin), ymax: Math.round(ymax)};
                    }

                });

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:BandDetailsCtrl#changeBandPath
             * @methodOf materialsCloudApp.controller:BandDetailsCtrl
             *
             * @description
             * It updates the band graph for user input.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.changeBandPath = function() {
                var theTextBox = document.getElementById("bandPathTextBox");
                var string = theTextBox.value;
                var finalPath = getPathArrayFromPathString(string);
                $scope.bandInfo.plotObj.updateBandPlot(finalPath);
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:BandDetailsCtrl#resetDefaultBandPath
             * @methodOf materialsCloudApp.controller:BandDetailsCtrl
             *
             * @description
             * It updates the band graph for to its default path.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.resetDefaultBandPath = function() {
                var theTextBox = document.getElementById("bandPathTextBox");
                theTextBox.value = getPathStringFromPathArray($scope.bandInfo.jsondata.path);
                $scope.bandInfo.plotObj.updateBandPlot($scope.bandInfo.jsondata.path, true);
            };

            //It updates the band graph for to its default path.
            $scope.resetZoomPan = function() {
                $scope.bandInfo.plotObj.resetZoom();
            };

            // Swiches to drag-to-zoom mode
            $scope.dragToZoom = function() {

                $("#bandZoom").addClass('btn-primary');
                $("#bandZoom").removeClass('btn-default');
                $("#bandPan").addClass('btn-default');
                $("#bandPan").removeClass('btn-primary');

                $scope.bandInfo.plotObj.myChart.options.pan = {
                    enabled: false,
                    mode: "y"
                };
                $scope.bandInfo.plotObj.myChart.options.zoom = {
                    enabled: true,
                    mode: "y",
                    drag: true
                };
                $scope.bandInfo.plotObj.myChart.update();
            };

            // Swiches to drag-to-zoom mode
            $scope.dragToPan = function () {
                $("#bandPan").addClass('btn-primary');
                $("#bandPan").removeClass('btn-default');
                $("#bandZoom").addClass('btn-default');
                $("#bandZoom").removeClass('btn-primary');

                $scope.bandInfo.plotObj.myChart.options.pan = {
                    enabled: true,
                    mode: "y"
                };
                $scope.bandInfo.plotObj.myChart.options.zoom = {
                    enabled: false,
                    mode: "y",
                    drag: true
                };
                $scope.bandInfo.plotObj.myChart.update();
            };

        }
    ]
);