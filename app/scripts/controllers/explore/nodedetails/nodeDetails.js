"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:NodeDetailsCtrl
 * @description
 *
 * It is the main controller used to process commmon information in all
 * node details pages like node tree, basic node information, etc.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/nodeDetails.js
 *
 * @requires $scope : scope object for this page
 * @requires utils : to get utils functionality to create window
 * @requires CONFIG : materials cloud configuration file
 * @requires nodeService : service used to request node data from server
 * @requires messageService : service used to display status/error messages
 * @requires $window : rezise event of window object is used to resize node tree
 * @requires $timeout : used to add delay
 * @requires utils : util functionality to create windows/panels
 *
 */

angular.module("materialsCloudApp").controller('NodeDetailsCtrl',
    ["$scope", "$state", "$stateParams", "CONFIG", "nodeService", "storageService", "messageService", "$window", "utils",
        function ($scope, $state, $stateParams, CONFIG, nodeService, storageService, messageService, $window, utils) {

            $scope.$parent.$parent.selectedView = "detailsView";

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:NodeDetailsCtrl#nodeId
             * @propertyOf materialsCloudApp.controller:NodeDetailsCtrl
             *
             * @description
             * id of the node whose details are displayed.
             */
            $scope.nodeId = $stateParams.nodeId;

            $scope.$parent.nodeUuid = $scope.nodeId;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:NodeDetailsCtrl#paramNodeType
             * @propertyOf materialsCloudApp.controller:NodeDetailsCtrl
             *
             * @description
             * type of the node whose details are displayed passed as an url parameter.
             */
            $scope.paramNodeType = $stateParams.nodeType;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:NodeDetailsCtrl#nodeDisplayName
             * @propertyOf materialsCloudApp.controller:NodeDetailsCtrl
             *
             * @description
             * display name of the node whose details are displayed.
             */
            $scope.nodeDisplayName = "";
            $scope.nodeDisplayType = "";

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:NodeDetailsCtrl#nodeAttributes
             * @propertyOf materialsCloudApp.controller:NodeDetailsCtrl
             *
             * @description
             * attributes of the node whose details are displayed.
             */
            $scope.nodeAttributes = {};

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:NodeDetailsCtrl#nodeAttributes
             * @propertyOf materialsCloudApp.controller:NodeDetailsCtrl
             *
             * @description
             * attributes of the node whose details are displayed, sorted alphabetically.
             */
            $scope.nodeAttributesOrdered = {};

            $scope.nodeDataLoading = true;

            /**
             * If node type is passed as an url parameter then use that.
             */
            if($scope.paramNodeType !== undefined && $scope.paramNodeType !== "")
                $scope.nodeType = $scope.paramNodeType;



            /**
             * @ngdoc
             * @name materialsCloudApp.controller:NodeDetailsCtrl#getDataAttributes
             * @methodOf materialsCloudApp.controller:NodeDetailsCtrl
             *
             * @description
             * It works on:
             *  - requests node data/attributes from server using nodeService
             *  - create window/panel for default attributes and display it
             *  - set template to display other attributes
             *
             * @param {int} nId node id.
             * @param {string} nType node type.
             *
             * @returns {undefined} It doesn't return.
             */
            function getDataAttributes(nId, nType) {

                /**
                 * Define default attributes order and their metadata to display
                 */
                if($scope.nodeType === "COMPUTER") {
                    $scope.$parent.defaultAttributesOrder = ["id", "uuid", "name", "hostname", "description", "enabled",
                        "scheduler_type", "transport_type", "transport_params"];

                    $scope.$parent.defaultAttributes = {
                        id: {displayName: "Id", value: "", display: true, hoverText: ""},
                        uuid: {displayName: "Uuid", value: "", display: true, hoverText: ""},
                        name: {displayName: "Name", value: "", display: true, hoverText: ""},
                        hostname: {displayName: "Hostname", value: "", display: true, hoverText: ""},
                        description: {displayName: "Description", value: "", display: true, hoverText: ""},
                        enabled: {displayName: "Enabled", value: "", display: true, hoverText: ""},
                        scheduler_type: {displayName: "Scheduler type", value: "", display: true, hoverText: ""},
                        transport_type: {displayName: "Transport type", value: "", display: true, hoverText: ""},
                        transport_params: {displayName: "Transport parameters", value: "", display: true, hoverText: ""}
                    };
                }
                else {
                    $scope.$parent.defaultAttributesOrder = ["id", "uuid", $scope.typeColumnName, "state", "ctime", "mtime",
                        "label", "user", "user_email", "computer_name", "dbcomputer_id"];

                    $scope.$parent.defaultAttributes = {
                        id: {displayName: "Id", value: "", display: true, hoverText: ""},
                        uuid: {displayName: "Uuid", value: "", display: true, hoverText: ""},
                        state: {displayName: "State", value: "", display: true, hoverText: ""},
                        ctime: {displayName: "Created", value: "", display: true, hoverText: ""},
                        mtime: {displayName: "Modified ", value: "", display: true, hoverText: ""},
                        label: {displayName: "Label", value: "", display: true, hoverText: ""},
                        user_email: {displayName: "User", value: "", display: true, hoverText: ""},
                        user: {displayName: "Creator", value: "", display: true, hoverText: ""},
                        computer_name: {displayName: "Computer", value: "", display: true, hoverText: ""},
                        dbcomputer_id: {displayName: "Computer Id", value: "", display: false, hoverText: ""}
                    };
                    $scope.$parent.defaultAttributes[$scope.typeColumnName] = {displayName: "Type", value: "", display: true, hoverText: ""};
                }

                $scope.nodeDbType = nType;
                if(nType.indexOf(".") !== -1){
                    nType = nType.split(".")[0];
                }

                var restApiVersion = $scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase();
                var dPath = CONFIG.DATA_PATH[restApiVersion][nType];

                nodeService.getSingleNode(nType, nId, $scope.profileRestEndPoint)
                    .then(function (response) {
                            //get metadata
                            var metadata = response.data.data[dPath];
                            if (metadata.length > 0) {

                                $scope.nodeDataLoading = false;

                                metadata = metadata[0];

                                // node type in database
                                $scope.nodeDbType = metadata[$scope.typeColumnName];

                                if (restApiVersion === 'V4' && $scope.nodeDbType !== undefined)
                                    $scope.nodeDbType = $scope.nodeDbType.split("|")[0];
                                $scope.nodeDisplayName = CONFIG.DISPLAY_NAMES[restApiVersion][$scope.nodeDbType];

                                // TODO: check first the REST API version and split according to the full_type syntax
                                if($scope.nodeDbType !== undefined) {
                                    if ($scope.nodeDbType.indexOf(".") !== -1) {
                                        var parts = $scope.nodeDbType.split(".");
                                        $scope.nodeDisplayType = parts[parts.length - 2];
                                    }
                                    else
                                        $scope.nodeDisplayType = $scope.nodeDbType;
                                }
                                else
                                    $scope.nodeDisplayType = $scope.nodeType;

                                $scope.displayUuid = metadata.uuid;

                                //$parent.defaultAttributes
                                $.each($scope.$parent.defaultAttributesOrder, function (idx, attr) {
                                    if(metadata[attr] !== undefined && metadata[attr] !== null && metadata[attr] !== ""){
                                        if(attr === "ctime" || attr === "mtime") {
                                            var datedict = utils.processDateFormat(metadata[attr]);
                                            var datestr = "";
                                            if (datedict.istimeago == false)
                                                datestr += " on ";
                                            datestr += datedict.formattedDate;
                                            $scope.$parent.defaultAttributes[attr].value = datestr;
                                        }
                                        else if (attr === "uuid")
                                            $scope.$parent.defaultAttributes[attr].value = metadata[attr].split("-")[0];
                                        else if (attr === "node_type" || attr === "type") {
                                            var parts = metadata[attr].split(".");
                                            $scope.$parent.defaultAttributes[attr].value = parts[parts.length - 2];
                                        }
                                        else if (attr === "full_type") {
                                            var parts = metadata[attr].split("|");
                                            if (parts[0].startsWith("data")) {
                                                $scope.$parent.defaultAttributes[attr].value = parts[0];
                                            } else
                                                $scope.$parent.defaultAttributes[attr].value = parts[parts.length - 1];
                                        }
                                        else
                                            $scope.$parent.defaultAttributes[attr].value = metadata[attr];

                                        $scope.$parent.defaultAttributes[attr].hoverText = metadata[attr];
                                    }
                                    else if (attr === "user") {
                                        $scope.$parent.defaultAttributes[attr].value = $scope.users[metadata.user_id]["name"] + " (" + $scope.users[metadata.user_id]["institution"] + ")";
                                    }
                                    else {
                                        $scope.$parent.defaultAttributes[attr].display = false;
                                    }
                                });


                                if($scope.nodeDisplayName === undefined){
                                    $scope.nodeDisplayName = $scope.nodeType;
                                }

                                var nodeTypeUpdated = "";

                                if($scope.nodeType === "NODE")
                                    nodeTypeUpdated = $scope.nodeDbType.split(".")[0].toUpperCase();
                                else
                                    nodeTypeUpdated = $scope.nodeType;

                                if (nodeTypeUpdated === "COMPUTER") {
                                    if (restApiVersion === 'V2')
                                        $scope.nodeAttributes = metadata._metadata;
                                    else
                                        $scope.nodeAttributes = metadata.metadata;
                                    $scope.dataType = "COMPUTER";
                                }
                                else {
                                    // TODO: ask for attributes
                                    $scope.nodeAttributes = metadata.attributes;
                                    // sort Object keys alphabetically, case insensitive
                                    Object.keys($scope.nodeAttributes).sort(function (a, b) {
                                        return a.localeCompare(b, undefined, {sensitivity: 'base'});
                                    }).forEach(function(key) {
                                        $scope.nodeAttributesOrdered[key] = $scope.nodeAttributes[key];
                                    });

                                    if(nodeTypeUpdated === "DATA") {
                                        var template = CONFIG.NODE_DETAILS.TEMPLATES[restApiVersion][nodeTypeUpdated][$scope.nodeDbType];
                                        if (template !== undefined)
                                            $scope.dataType = template;
                                        else
                                            $scope.dataType = "DATA";
                                    }
                                    else if(nodeTypeUpdated === "CALCULATION" || nodeTypeUpdated === "PROCESS") {
                                        var template = CONFIG.NODE_DETAILS.TEMPLATES[restApiVersion][nodeTypeUpdated][$scope.nodeDbType];
                                        if (template !== undefined)
                                            $scope.dataType = template;
                                        else
                                            $scope.dataType = "CALCULATION";
                                    }
                                    else if(nodeTypeUpdated === "CODE") {
                                        $scope.dataType = "CODE";
                                    }
                                    else {
                                        $scope.dataType = "";
                                    }
                                }
                            }
                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while getting data from the server (either server is down or passed node uuid is not available)!",
                                CONFIG.MESSAGE_TYPE.ERROR, response);
                            $scope.$parent.displayBasicDetails = false;
                        });
            }




            /**
             * @ngdoc
             * @name materialsCloudApp.controller:NodeDetailsCtrl#GoToNodeDetails
             * @methodOf materialsCloudApp.controller:NodeDetailsCtrl
             *
             * @description
             * It changes the state url to go to the node details page
             *
             * @param {int} id node id.
             * @param {string} type node type.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.GoToNodeDetails = function(id, type) {
                // change state to node details
                var updatedType = type.split(".")[0].toUpperCase();
                $state.go("main.explore.dashboard.details.viewnode", {"nodeId": id, "nodeType": updatedType},
                    {reload: "main.explore.dashboard.details.viewnode"}
                );
            };


            function display_details() {
                /**
                 * If state url contains node id, then it is a details state url.
                 * Call the displayNodeTree and getDataAttributes functions to display
                 * node details.
                 */

                $scope.users = JSON.parse(storageService.getItem($scope.profileRestEndPoint + "-users"));
                if ($scope.users === null) {
                    $scope.users = nodeService.getUsers($scope.profileRestEndPoint);
                }

                if ($scope.nodeId !== undefined && $scope.nodeId.length > 0) {
                    // get node details
                    $scope.$parent.displayBasicDetails = true;
                    if ($scope.nodeType != "COMPUTER")
                        $scope.$parent.displayBasicNodeDetails = true;
                    getDataAttributes($scope.nodeId, $scope.nodeType);
                }
                else {
                    messageService.updateMessage("Node uuid is not passed!",
                        CONFIG.MESSAGE_TYPE.ERROR, "");
                }
            }

            if($scope.selectedProfileInfo)
                display_details();


            $scope.$on("RestApiVersionReady", function(event) {
                display_details();
            });
        }
    ]);

