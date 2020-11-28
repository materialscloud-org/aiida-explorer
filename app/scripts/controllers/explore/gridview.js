"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:GridViewCtrl
 * @description
 *
 * It is the controller for Explore section.
 *
 * #### File location: app/scripts/controllers/explore/gridview.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to get the state (url) details
 * @requires CONFIG : materials cloud configuration file
 *
 */
angular.module("materialsCloudApp").controller("GridViewCtrl",
    ["$scope", "$state", "$stateParams", "CONFIG", "nodeService", "utils",
        function ($scope, $state, $stateParams, CONFIG, nodeService, utils) {

            $scope.$parent.$parent.selectedView = "gridView";

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:GridViewCtrl#nodeInfo
             * @propertyOf materialsCloudApp.controller:GridViewCtrl
             *
             * @description
             *  stores the information about node like its id, type and filters.
             */
            $scope.nodeInfo = {};

            $scope.nodeInfo.nodeType = $state.params.nodeType;
            $scope.nodeInfo.nodeFilter = $state.params.nodeFilter;
            $scope.nodeInfo.isGrid = "";

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:GridViewCtrl#applyFilter
             * @methodOf materialsCloudApp.controller:GridViewCtrl
             *
             * @description
             * It updates the scope variable "$scope.nodeInfo.nodeFilter" for selected node filters
             *
             * @param {object} filter list of filters to apply on node table
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.applyFilter = function(filter){
                $scope.nodeInfo.nodeFilter = filter;
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:GridViewCtrl#goToState
             * @methodOf materialsCloudApp.controller:GridViewCtrl
             *
             * @description
             * It gets the state name for selected node type and go to the new state.
             *
             * @example
             * GridViewCtrl.goToState("DATA");
             *
             * @param {string} nodetype type of the node. E.g. CALCULATION, DATA, CODE, COMPUTER
             *
             * @returns {undefined} It doesn't return.
             */
            function goToState(nodetype) {
                // update nodeType here because explore page doesn't upload again
                $scope.nodeInfo.nodeType = nodetype;

                var state = CONFIG.NODE_STATE_MAPPING[nodetype];
                $state.go(state, { nodeType: nodetype , nodeFilter: $scope.nodeInfo.nodeFilter}, {reload: true});
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:GridViewCtrl#setNodeType
             * @methodOf materialsCloudApp.controller:GridViewCtrl
             *
             * @description
             * If nodeInfo.nodeType is same as received nodetype, it applies the filters on
             * current node table else it calls goToState(nodetype) method to go to new state.
             *
             * @param {string} nodetype type of the node. E.g. CALCULATION, DATA, CODE, COMPUTER
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.setNodeType = function(nodetype){

                var nodetypeUpper = nodetype.toUpperCase();
                if( $scope.nodeInfo.nodeType === nodetypeUpper || ($scope.nodeInfo.nodeType === "CALCULATION" && nodetypeUpper === "PROCESS")) {
                    if($scope.nodeInfo.isGrid === false){
                        goToState(nodetypeUpper);
                    }
                    else{
                        $scope.$broadcast('applyFilter', {filter: $scope.nodeInfo.nodeFilter});
                    }
                } else {
                    goToState(nodetypeUpper);
                }
            };



            function display_sidemenu() {

                $scope.sideMenuLoading = true;

                nodeService.getNodetypes("NODE", $scope.profileRestEndPoint).then(function (response) {
                        if ($scope.profileRestEndPoint.endsWith('v2') || $scope.profileRestEndPoint.endsWith('v3')) {
                            var orderedNodeTypes = CONFIG.GRID.NODE_TYPES_ORDER;
                            var orderedNtypes = {};
                            let ntypes = response.data;
                            if (ntypes) {
                                $.each(orderedNodeTypes, function (index, nodetype){
                                    if (ntypes.hasOwnProperty(nodetype)){
                                        orderedNtypes[nodetype] = new Array();
                                        $.each(ntypes[nodetype], function (idx, nvalue) {
                                            orderedNtypes[nodetype][idx] = {
                                                "display_name": utils.getDisplayName(nvalue),
                                                "filter_name": nvalue
                                            };
                                        });
                                    }
                                });
                            }

                            $scope.availableNodeTypes = orderedNtypes;
                        } else {
                            var namespaces = response.data.subspaces;
                            $.each(namespaces, function (index, namespace){
                                namespace["expanded"] = true;
                            });

                            var addNodeType = function(namespaces) {
                                $.each(namespaces, function (index, namespace){
                                    namespace["nodeType"] = namespace.path.split(".")[1];
                                    if (namespace.subspaces.length > 0)
                                        // Sort namespace.subspaces array alphabetically by label
                                        namespace.subspaces.sort(function(a, b) {
                                            return a.label.localeCompare(b.label)
                                        });
                                        addNodeType(namespace.subspaces);
                                });
                            };
                            addNodeType(namespaces);

                            $scope.treeData = new kendo.data.HierarchicalDataSource({
                                data: namespaces,
                                schema: {
                                    model: {
                                        fields: {
                                            text: {
                                                from: "label"
                                            }
                                        },
                                        children: "subspaces"
                                    }
                                }
                            });
                        }

                        $scope.sideMenuLoading = false;
                    },
                    function (response) {
                        // Ajax error: ntypes dict is not received from server. Use default values.
                        $scope.availableNodeTypes = CONFIG.SIDE_MENU_DEFAULTS;
                        $scope.sideMenuLoading = false;
                    });
            }

            if ($scope.profileRestEndPoint)
                display_sidemenu();

            if($scope.nodeInfo.nodeFilter === undefined)
                $scope.nodeInfo.nodeFilter = "";

            if($state.current.name === "main.explore.dashboard.grid.codes"){
                $scope.nodeInfo.nodeType = "CODE";
                $state.go(CONFIG.NODE_STATE_MAPPING.CODE);
            }
            else if($state.current.name === "main.explore.dashboard.grid.computers"){
                $scope.nodeInfo.nodeType = "COMPUTER";
                $state.go(CONFIG.NODE_STATE_MAPPING.COMPUTER);

            }
            else if($state.current.name === "main.explore.dashboard.grid.data"){
                $scope.nodeInfo.nodeType = "DATA";
                if (typeof $scope.selectedProfileInfo !== "undefined") {
                    if ($scope.nodeInfo.nodeFilter === "") {
                        $scope.nodeInfo.nodeFilter = CONFIG.GRID["FILTERS_" + $scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DATA"]["value"];
                    }
                    $state.go(CONFIG.NODE_STATE_MAPPING.DATA, {nodeType: "DATA", nodeFilter: $scope.nodeInfo.nodeFilter});
                } else {
                    $state.go(CONFIG.NODE_STATE_MAPPING.DATA);
                }
            }
            else if($state.current.name === "main.explore.dashboard.grid" || $state.current.name === "main.explore.dashboard.grid.calculations"){
                $scope.nodeInfo.nodeType = "CALCULATION";
                if (typeof $scope.selectedProfileInfo !== "undefined") {
                    if ($scope.nodeInfo.nodeFilter === "") {
                        $scope.nodeInfo.nodeFilter = CONFIG.GRID["FILTERS_" + $scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["CALCULATION"]["value"];
                    }
                    $state.go(CONFIG.NODE_STATE_MAPPING.CALCULATION, {nodeType: "CALCULATION", nodeFilter: $scope.nodeInfo.nodeFilter});
                } else {
                    $state.go(CONFIG.NODE_STATE_MAPPING.CALCULATION);
                }
            }

            $scope.$on("RestApiVersionReady", function(event) {
                if($state.current.name === "main.explore.dashboard.grid" || $state.current.name === "main.explore.dashboard.grid.calculations"){
                    $scope.nodeInfo.nodeType = "CALCULATION";
                    if ($scope.nodeInfo.nodeFilter === "") {
                        $scope.nodeInfo.nodeFilter = CONFIG.GRID["FILTERS_" + $scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["CALCULATION"]["value"];
                    }
                    $state.go(CONFIG.NODE_STATE_MAPPING.CALCULATION, {nodeType: "CALCULATION", nodeFilter: $scope.nodeInfo.nodeFilter});
                }
                else if($state.current.name === "main.explore.dashboard.grid.data"){
                    $scope.nodeInfo.nodeType = "DATA";
                    if ($scope.nodeInfo.nodeFilter === "") {
                        $scope.nodeInfo.nodeFilter = CONFIG.GRID["FILTERS_" + $scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["DATA"]["value"];
                    }
                    $state.go(CONFIG.NODE_STATE_MAPPING.DATA, {nodeType: "DATA", nodeFilter: $scope.nodeInfo.nodeFilter});
                }
                display_sidemenu();
            });
        }]);