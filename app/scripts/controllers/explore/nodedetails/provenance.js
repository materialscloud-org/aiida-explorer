"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:ProvenanceCtrl
 * @description
 *
 * It is the main controller used to process commmon information in all
 * node details pages like node tree, basic node information, etc.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/provenance.js
 *
 * @requires $scope : scope object for this page
 * @requires utils : to get utils functionality to create window
 * @requires CONFIG : materials cloud configuration file
 * @requires nodeService : service used to request node data from server
 * @requires graphService : service used to display node tree
 * @requires messageService : service used to display status/error messages
 * @requires $window : rezise event of window object is used to resize node tree
 * @requires $timeout : used to add delay
 *
 */

angular.module("materialsCloudApp").controller('ProvenanceCtrl',
    ["$scope", "$state", "$stateParams", "CONFIG", "nodeService", "graphService",
        "messageService", "$window", "$timeout",
        function ($scope, $state, $stateParams, CONFIG, nodeService, graphService,
                  messageService, $window, $timeout) {

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#vistree
             * @propertyOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * stores the object of node tree.
             */
            $scope.vistree = null;
            $scope.treeDataLoading = true;
            $scope.nodeLimitExceeded = false;
            $scope.nodeLimitExceededMsg = "";

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#treeResizer
             * @methodOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * It resizes the tree on window resize event.
             *
             * @returns {undefined} It doesn't return.
             */
            function treeResizer() {
                var treeContainerWidth = $('#treeContent').width();
                $('#treeContent').css({'height':treeContainerWidth+'px'});

                // adjust overlay div
                $('#provenanceOverlay').css({'height':treeContainerWidth+'px'});
                $('#provenanceOverlay').css({'line-height':treeContainerWidth+'px'});
            }


            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#resetTree
             * @methodOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * It resets the tree with selected node whose details are displayed as a center node
             * and shows its input and output nodes.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.resetTree = function () {
                // reset tree here
                if($scope.vistree)
                    $scope.displayNodeTree($scope.nodeId, $scope.nodeType);
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#displayNodeTree
             * @methodOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * It requests tree data from server using nodeService and displays it in tree format.
             *
             * @param {int} id node id.
             * @param {string} type node type.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.displayNodeTree = function(id, type) {

                $scope.treeDataLoading = true;

                $timeout(function () {
                    treeResizer();
                    var container = $("#nodeTree")[0];

                    //graphService.visTree(dataItem, $scope.nodeType, container, $scope.getCalc);
                    var tree_url_params = {
                        "in_limit": CONFIG["NODE_LIMIT_PROVENANCE_BROWSER"],
                        "out_limit": CONFIG["NODE_LIMIT_PROVENANCE_BROWSER"]
                    };
                    nodeService.getMetadata(type, id, "IO_TREE", $scope.profileRestEndPoint, tree_url_params).then(
                        // handle success
                        function (response) {
                            var treeData = response.data.data;
                            if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v2' || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v3') {
                                var totalNumberIncomings = treeData["total_no_of_incomings"];
                                var totalNumberOutgoings = treeData["total_no_of_outgoings"];
                                var sentNumberIncomings = treeData["sent_no_of_incomings"];
                                var sentNumberOutgoings = treeData["sent_no_of_outgoings"];
                                var totalNumber = treeData.nodes.length;
                            } else {
                                var totalNumberIncomings = treeData.metadata[0]["total_no_of_incomings"];
                                var totalNumberOutgoings = treeData.metadata[0]["total_no_of_outgoings"];
                                var sentNumberIncomings = treeData.metadata[0]["sent_no_of_incomings"];
                                var sentNumberOutgoings = treeData.metadata[0]["sent_no_of_outgoings"];
                                var totalNumber = treeData.nodes.length + treeData.nodes[0].incoming.length + treeData.nodes[0].outgoing.length;
                            }

                            $timeout(function () {
                                if (treeData.nodes.length > 0) {

                                    $scope.nodeLimitExceededMsg = "";
                                    $scope.useTreeLimit = false;

                                    if (totalNumberIncomings !== undefined && totalNumberOutgoings !== undefined &&
                                    sentNumberIncomings !== undefined && sentNumberOutgoings !== undefined){
                                        if (sentNumberIncomings < totalNumberIncomings) {
                                            $scope.nodeLimitExceededMsg = totalNumberIncomings +
                                                " incoming nodes found, limited to " + sentNumberIncomings + " <br>";
                                        }
                                        if (sentNumberOutgoings < totalNumberOutgoings) {
                                            $scope.nodeLimitExceededMsg += totalNumberOutgoings +
                                                " outgoing nodes found, limited to " + sentNumberOutgoings;
                                        }
                                    }
                                    else {
                                        $scope.useTreeLimit = true;
                                        if(totalNumber > (CONFIG["NODE_LIMIT_PROVENANCE_BROWSER"] * 2)) {
                                            $scope.nodeLimitExceededMsg = totalNumber + " nodes found, limited to " + (CONFIG["NODE_LIMIT_PROVENANCE_BROWSER"] * 2);
                                        }
                                    }

                                    if($scope.nodeLimitExceededMsg !== ""){
                                        $scope.nodeLimitExceededMsg = "Warning: " + $scope.nodeLimitExceededMsg;
                                        $scope.nodeLimitExceeded = true;
                                    }
                                    $scope.vistree = graphService.visTree(treeData, container, $scope.displayShortDescription, $scope.useTreeLimit, $scope.selectedProfileInfo.REST_API_MAJOR_VERSION);
                                    $scope.treeDataLoading = false;
                                    $scope.displayShortDescription(treeData.nodes[0], false);

                                }
                            });
                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while getting data from the server (either server is down or passed node uuid is not available)!",
                                CONFIG.MESSAGE_TYPE.ERROR, response);
                        }
                    );
                });
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#nodeShortJson
             * @propertyOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * short description of the node selected in a tree.
             */
            $scope.nodeShortJson = {};

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#doubleClickTime
             * @propertyOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * double click time
             */
            var doubleClickTime = 0;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#threshold
             * @propertyOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * threshold between the single click and double click on tree node
             */
            var threshold = 200;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#treeOnClick
             * @methodOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * As double click is a 2 single clicks, we need to differenciate between two.
             * On single click, we display the short description and on double click, we
             * display the details of the selected node. If the difference between 2 single
             * clicks is less than the threshold value then it is a double click else it is a
             * single click.
             *
             * @param {object} node node details object.
             * @param {boolean} visualizeNode stores boolean value to decide to
             * display node details or the short description of the selected node.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.treeOnClick = function(node, visualizeNode) {
                var t0 = new Date();
                if (t0 - doubleClickTime > threshold) {
                    setTimeout(function () {
                        if (t0 - doubleClickTime > threshold) {
                            $scope.displayShortDescription(node, false);
                        }
                    },threshold);
                }
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:ProvenanceCtrl#displayShortDescription
             * @methodOf materialsCloudApp.controller:ProvenanceCtrl
             *
             * @description
             * If visualizeNode is true: go to the node details page of the selected node
             * If visualizeNode is false: display short description of the selected node
             *
             * @param {object} node node details object.
             * @param {boolean} visualizeNode stores boolean value to decide to
             * display node details or the short description of the selected node.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.displayShortDescription = function (node, visualizeNode){

                if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v2' || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == 'v3') {
                    var id = node.nodeuuid;
                    var type = node.nodetype;
                    var linktype = "";
                    if(node.linktype !== undefined)
                        linktype = node.linktype;
                } else {
                    var id = node.uuid;
                    var type = node.node_type;
                    var linktype = "";
                    if(node.link_type !== undefined)
                        linktype = node.link_type;
                }

                if(type.indexOf(".") !== -1){
                    type = type.split(".")[0].toUpperCase();
                    if (type == "PROCESS")
                        type = "CALCULATION";
                }

                // display tree again
                //if($scope.vistree)
                //    $scope.displayNodeTree(id, type);

                // test data
                $timeout(function(){

                    $scope.nodeShortJson = {
                        Id: id,
                        Type: type.split(".").reverse()[1],
                        "Link type": linktype,
                        "Short description": node.description
                    };
                    $scope.$apply();

                });

                if(visualizeNode){
                    $scope.GoToNodeDetails(id, "NODE");
                }
            };

            angular.element($window).bind('resize', function(){
                if($scope.vistree){
                    treeResizer();
                }
            });


            // display tree
            $scope.displayNodeTree($scope.nodeId, $scope.nodeType);

        }
    ]);

