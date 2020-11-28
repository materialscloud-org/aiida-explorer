"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:CalcDetailsCtrl
 * @description
 *
 * It is the default controller to display details of any type of the calculation
 * if dedicated controller is not available for that calculation type.
 *
 * #### File location: app/scripts/controllers/explore/nodedetails/process/calcjob.js
 *
 * @requires $scope : scope object for this page
 * @requires $timeout : used to add delay
 *
 */

angular.module("materialsCloudApp").controller('CalcDetailsCtrl',
    ["$scope", "$timeout", "$mdDialog", "CONFIG", "nodeService", "messageService",
        function ($scope, $timeout, $mdDialog, CONFIG, nodeService, messageService) {

            $scope.displaySourcefile = false;
            $scope.displayLastjob = false;
            $scope.mainMetadata = [
                {"key": "job_id", "display_name": "Job Id"},
                {"key": "parser", "display_name": "Parser"},
                {"key": "state", "display_name": "State"},
                {"key": "scheduler_state", "display_name": "Scheduler state"},
                {"key": "remote_workdir", "display_name": "Remote working directory"},
                {"key": "computer", "display_name": "Computer"}
            ];
            $scope.mainMetadataKeys = [];
            $.each($scope.mainMetadata, function(idx, info){
                $scope.mainMetadataKeys.push(info.key);
            });

            /**
             * It creates the windows to display node attributes and node source file.
             */
            $timeout(function () {

                if($scope.nodeAttributes.last_jobinfo !== undefined) {
                    $scope.displayLastjob = true;
                    $scope.lastjob = angular.fromJson($scope.nodeAttributes.last_jobinfo);
                } else if ($scope.nodeAttributes.last_job_info !== undefined) {
                    $scope.displayLastjob = true;
                    $scope.lastjob = angular.fromJson($scope.nodeAttributes.last_job_info);
                }

                if($scope.nodeAttributes.source_file !== undefined)
                    $scope.sourcefile = $scope.nodeAttributes.source_file;
                else if($scope.nodeAttributes.source_code !== undefined)
                    $scope.sourcefile = $scope.nodeAttributes.source_code;
                else
                    $scope.sourcefile = "Source file/code is not available!";

                $scope.displaySourcefile = true;

            });

            $scope.retrievedInputs = new Array();
            $scope.retrievedOutputs = new Array();

            function getInputsRecursively(filename) {
                if (typeof filename !== "undefined") {
                    var paramsDict = {"filename": filename};
                    var prepend = filename + "/";
                } else {
                    var paramsDict = {};
                    var prepend = "";
                }
                nodeService.getMetadata("CALCJOB", $scope.nodeId, "RETRIEVED_INPUTS", $scope.profileRestEndPoint, paramsDict)
                .then(function (response) {
                        var retrievedInputs = response.data.data;
                        $.each(retrievedInputs, function(index, value){
                            if (value.type == "FILE") {
                                $scope.retrievedInputs.push(prepend + value.name);
                            } else if (value.type == "DIRECTORY") {
                                getInputsRecursively(prepend + value.name);
                            }
                        });
                    },
                    // handle error
                    function (response) {
                        messageService.updateMessage("Error while getting retrieved inputs from the server!",
                            CONFIG.MESSAGE_TYPE.ERROR, response);

                    }
                );
                $scope.loadingRetrievedInputs = false;
            }

            function getOutputsRecursively(filename) {
                if (typeof filename !== "undefined") {
                    var paramsDict = {"filename": filename};
                    var prepend = filename + "/";
                } else {
                    var paramsDict = {};
                    var prepend = "";
                }
                nodeService.getMetadata("CALCJOB", $scope.nodeId, "RETRIEVED_OUTPUTS", $scope.profileRestEndPoint, paramsDict)
                .then(function (response) {
                        var retrievedOutputs = response.data.data;
                        $.each(retrievedOutputs, function(index, value){
                            if (value.type == "FILE") {
                                $scope.retrievedOutputs.push(prepend + value.name);
                            } else if (value.type == "DIRECTORY") {
                                getOutputsRecursively(prepend + value.name);
                            }
                        });
                    },
                    // handle error
                    function (response) {
                        $scope.isRetrievedOutputsAvailable = false;
                        $scope.loadingRetrievedOutputs = false;
                    }
                );
                $scope.loadingRetrievedOutputs = false;
            }

            $scope.outputFolderDataId = "";

            var baseUrl = $scope.profileRestEndPoint
                + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["CALCULATION"] + "/" + $scope.nodeId;

            if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == "v2" || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == "v3") {
                $scope.retrievedInputDownloadUrl = baseUrl
                    + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["RETRIEVED_INPUTS"] + "?rtype=download&filename=";
                $scope.retrievedOutputDownloadUrl = baseUrl
                    + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["RETRIEVED_OUTPUTS"] + "?rtype=download&filename=";
            } else {
                $scope.retrievedInputDownloadUrl = baseUrl
                    + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["REPO_CONTENTS"] + "?filename=";
                nodeService.getMetadata("NODE", $scope.nodeId, "OUTPUTS", $scope.profileRestEndPoint)
                    .then(function (response) {
                            var outgoingNodes = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["OUTGOING"]];
                            $.each(outgoingNodes, function(index, node){
                                if (node.node_type == "data.folder.FolderData."){
                                    $scope.outputFolderDataId = node.uuid;
                                }
                            });
                            $scope.retrievedOutputDownloadUrl = $scope.profileRestEndPoint + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["CALCULATION"]
                                + "/" + $scope.outputFolderDataId + CONFIG.REST_API.NODE[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["REPO_CONTENTS"] + "?filename=";
                        },
                        function (response) {
                            messageService.updateMessage("Error while getting outgoing links from the server!",
                                CONFIG.MESSAGE_TYPE.ERROR, response);
                        }
                    );
            }

            $scope.loadingRetrievedInputs = true;
            $scope.loadingRetrievedOutputs = true;
            $scope.mainInputFiles = ["aiida.in", "_aiidasubmit.sh"];
            $scope.mainOutputFiles = ["aiida.out"];
            $scope.isRetrievedOutputsAvailable = true;

            if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == "v2" || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == "v3") {
                nodeService.getMetadata("CALCJOB", $scope.nodeId, "RETRIEVED_INPUTS", $scope.profileRestEndPoint)
                    .then(function (response) {
                            $scope.loadingRetrievedInputs = false;
                            $scope.retrievedInputs = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["RETRIEVED_INPUTS"]];
                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while getting retrieved inputs from the server!",
                                CONFIG.MESSAGE_TYPE.ERROR, response);

                        }
                    );
                nodeService.getMetadata("CALCJOB", $scope.nodeId, "RETRIEVED_OUTPUTS", $scope.profileRestEndPoint)
                    .then(function (response) {
                            $scope.loadingRetrievedOutputs = false;
                            $scope.retrievedOutputs = response.data.data[CONFIG.DATA_PATH[$scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["RETRIEVED_OUTPUTS"]];
                        },
                        // handle error
                        function (response) {
                            $scope.isRetrievedOutputsAvailable = false;
                            $scope.loadingRetrievedOutputs = false;

                        }
                    );
            } else {
                getInputsRecursively();
                getOutputsRecursively();
            }

            $scope.displayFileContents= function (ev, type, filename){

                var rtype = "";
                if ($scope.selectedProfileInfo.REST_API_MAJOR_VERSION == "v2" || $scope.selectedProfileInfo.REST_API_MAJOR_VERSION == "v3") {
                    var nodeId = $scope.nodeId;
                    if (type == "input")
                        rtype = "RETRIEVED_INPUTS";
                    else if (type == "output")
                        rtype = "RETRIEVED_OUTPUTS";
                    var paramsDict = {"filename": '"' + filename + '"', "rtype": "download"};
                } else {
                    if (type == "input")
                        var nodeId = $scope.nodeId;
                    else if (type == "output")
                        var nodeId = $scope.outputFolderDataId;
                    rtype = "REPO_CONTENTS";
                    var paramsDict = {"filename": '"' + filename + '"'};
                }

                if (rtype != "" && filename != "") {

                    $scope.filename = filename;

                    nodeService.getMetadata("CALCULATION", nodeId, rtype, $scope.profileRestEndPoint, paramsDict)
                        .then(function (response) {

                                // TODO: improve it to check if response contains json data
                                if($scope.filename.endsWith(".json")){
                                    $scope.filecontent = JSON.stringify(response.data, null, 4);
                                }
                                else {
                                    $scope.filecontent = response.data;
                                }

                                $mdDialog.show({
                                    controller: "fileDialogCtrl",
                                    templateUrl: "views/explore/nodedetails/process/filedialog.html",
                                    parent: angular.element(document.querySelector('#popupContainer')),
                                    clickOutsideToClose: true,
                                    fullscreen: false,
                                    targetEvent: ev,
                                    scope: $scope,
                                    preserveScope: true
                                });

                            },
                            // handle error
                            function (response) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#popupContainer')))
                                        .clickOutsideToClose(true)
                                        .title("File: " + filename)
                                        .textContent("Error while getting file from the server!")
                                        .ok('Ok')
                                        .targetEvent(ev)
                                );
                            }
                        );
                }
            }
        }
    ]
);