"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:BasenodeviewCtrl
 * @description
 *
 * It is the base controller to display node table.
 *
 * #### File location: app/scripts/controllers/explore/basenodeview.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to get the state (url) details
 * @requires nodeService : service to get the node data from server
 * @requires tableService : service used to generate table
 * @requires graphService : service used to plot statistics
 * @requires messageService : message service to update status/error messages
 * @requires storageService : service used to store table schema in session storage
 * @requires CONFIG : materials cloud configuration file
 *
 */

angular.module("materialsCloudApp").controller("BasenodeviewCtrl", ["$scope", "$state", "nodeService", "tableService",
    "graphService", "messageService", "storageService", "CONFIG",
    function ($scope, $state, nodeService, tableService, graphService, messageService,
              storageService, CONFIG) {


        /**
         * @ngdoc
         * @name materialsCloudApp.controller:BasenodeviewCtrl#nodeDisplayName
         * @propertyOf materialsCloudApp.controller:BasenodeviewCtrl
         *
         * @description
         *  short node display name defined in materials cloud configuration file.
         *  For example, display name for "calculation.job.quantumespresso.pw.PwCalculation."
         *  is "Quantum ESPRESSO-PW".
         */
        $scope.nodeDisplayName = CONFIG.DISPLAY_NAMES[$scope.nodeInfo.nodeType];

        /**
         * As it is a base controller to display node table, nodeInfo.isGrid boolean is true.
         */
        $scope.nodeInfo.isGrid = true;

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:BasenodeviewCtrl#displayNodeDetails
         * @methodOf materialsCloudApp.controller:BasenodeviewCtrl
         *
         * @description
         * It goes to the "details" state of the selected node.
         *
         * @param {object} node node information object
         *
         * @returns {undefined} It doesn't return.
         */
        $scope.displayNodeDetails = function (node) {
            // go to state details
            if ($scope.nodeInfo.nodeType == "COMPUTER"){
                $state.go("main.explore.dashboard.details.viewnode", {nodeId: node.uuid, nodeType: $scope.nodeInfo.nodeType});
            } else {
                $state.go("main.explore.dashboard.details.viewnode", {nodeId: node.uuid, nodeType: "NODE"});
            }
        };

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:BasenodeviewCtrl#columns
         * @propertyOf materialsCloudApp.controller:BasenodeviewCtrl
         *
         * @description
         *  list of columns of the node table.
         */
        $scope.columns = [];

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:BasenodeviewCtrl#isStateColumn
         * @propertyOf materialsCloudApp.controller:BasenodeviewCtrl
         *
         * @description
         *  it stores the boolean true if the column is a state column else false.
         */
        $scope.isStateColumn = "";

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:BasenodeviewCtrl#customFilters
         * @methodOf materialsCloudApp.controller:BasenodeviewCtrl
         *
         * @description
         * If filters (node type) are selected for node table, it reformats
         * the dict with key as a "custom" and selected filters as a value.
         *
         * @returns {object} updated filter object.
         */
        function customFilters () {
            var filter = {};
            if ($scope.nodeInfo.nodeFilter != "") {
                filter.custom = $scope.nodeInfo.nodeFilter;
            }
            return filter;
        }

        /**
         * @ngdoc
         * @name materialsCloudApp.controller:BasenodeviewCtrl#processColumn
         * @methodOf materialsCloudApp.controller:BasenodeviewCtrl
         *
         * @description
         * It processes the column value before displaying it in table. For processing,
         * it uses tableService method "processCellValue(name, value)".
         *
         * @param {string} name key (column name) from the node json
         * @param {string} value value of the table cell passed for processing
         * @param {object} attributes node attributes
         *
         * @returns {string} processed table cell value.
         */
        $scope.processColumn = function (name, value, attributes) {
            if(name === "attributes.state"){
                if(attributes.state !== undefined){
                    value = attributes.state;
                }
                else {
                    value = "-"
                }
            }
            var columnInfo = tableService.processCellValue(name, value, attributes, $scope.users, $scope.computers);
            $scope.isStateColumn = columnInfo.isStateColumn;
            return columnInfo.value;
        };


        function display_grid() {
            /**
             * get the users from session storage. If it is null then:
             *  - request the users from the server using nodeService
             *  - store the users in session storage
             */
            $scope.users = JSON.parse(storageService.getItem($scope.profileRestEndPoint + "-users"));
            if ($scope.users === null) {
                $scope.users = nodeService.getUsers($scope.profileRestEndPoint);
            }

            /**
             * get the table columns from session storage. If it is null then:
             *  - request the table schema from the server using nodeService
             *  - process columns list using tableService
             *  - store the table schema in session storage
             */
            $scope.columns = JSON.parse(storageService.getItem($scope.profileRestEndPoint + "-" + $scope.nodeInfo.nodeType + "-grid-columns"));
            if ($scope.columns === null) {
                nodeService.getSchema($scope.nodeInfo.nodeType, $scope.profileRestEndPoint).then(
                    // handle success
                    function (response) {
                        $scope.columns = tableService.getNgTableColumns(response, true);
                        storageService.addItem($scope.profileRestEndPoint + "-" + $scope.nodeInfo.nodeType + "-grid-columns", JSON.stringify($scope.columns));
                    },
                    // handle error
                    function (response) {
                        messageService.updateMessage("Error while connecting to server!",
                            CONFIG.MESSAGE_TYPE.ERROR, response);
                    }
                );
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:BasenodeviewCtrl#tableParams
             * @propertyOf materialsCloudApp.controller:BasenodeviewCtrl
             *
             * @description
             *  it stores the table object created by using tableService.
             */
            $scope.tableParams = tableService.gridNgTable($scope.nodeInfo.nodeType, $scope.dataPath, customFilters(),
                $scope.profileRestEndPoint, $scope.selectedProfileInfo.REST_API_MAJOR_VERSION, $scope.typeColumnName);

            if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION === 'v4') {
                angular.extend($scope.tableParams.filter(), customFilters());
            }

        }

        if ($scope.profileRestEndPoint) {
            /**
             * @ngdoc
             * @name materialsCloudApp.controller:BasenodeviewCtrl#dataPath
             * @propertyOf materialsCloudApp.controller:BasenodeviewCtrl
             *
             * @description
             *  key name used in REST response. for example for data nodes it is "data"
             *  and for calculation nodes it is "calculations".
             */
            $scope.dataPath = CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()][$scope.nodeInfo.nodeType];
            display_grid();
        }


        $scope.$on("RestApiVersionReady", function(event) {
            $scope.dataPath = CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()][$scope.nodeInfo.nodeType];
            display_grid();
        });


        /**
         * @ngdoc
         * @name materialsCloudApp.controller:BasenodeviewCtrl#$on
         * @methodOf materialsCloudApp.controller:BasenodeviewCtrl
         *
         * @description
         * It receives the broadcasted event "applyFilter" and applies the
         * filters on table.
         *
         * @returns {undefined} It doesn't return.
         */
        $scope.$on('applyFilter', function (event, obj) {
            if (obj.filter === "") {
                $scope.tableParams.filter({});
                $scope.tableParams.reload();
            }
            else {
                angular.extend($scope.tableParams.filter(), customFilters());
            }
        });

    }]
);
