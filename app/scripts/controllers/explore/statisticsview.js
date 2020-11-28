"use strict";

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:StatisticsViewCtrl
 * @description
 *
 * It is the controller for explore statistics section.
 *
 * #### File location: app/scripts/controllers/explore/statisticsview.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to get the state (url) details
 * @requires CONFIG : materials cloud configuration file
 *
 */
angular.module("materialsCloudApp").controller("StatisticsViewCtrl",
    ["$scope", "$state", "$stateParams", "CONFIG", "nodeService", "graphService",
        function ($scope, $state, $stateParams, CONFIG, nodeService, graphService) {

            $scope.$parent.selectedView = "statisticsView";
            $scope.isDisplayPlots = true;

            function countLeaves (namespace, types) {
                if (namespace.subspaces.length > 0) {
                    for (var subspace of namespace.subspaces)
                        countLeaves(subspace, types);
                } else {
                    if (namespace.full_type.startsWith("data"))
                        types[namespace["label"]] = namespace["counter"];
                    else if (namespace["full_type"].startsWith("process")) {
                        var processNode = namespace["full_type"].split("|")[0];
                        var processType = namespace["full_type"].split("|")[1];
                        if (processNode == "process.workflow.workfunction.WorkFunctionNode.") {
                            types["WorkFunctionNode"] = (types["WorkFunctionNode"] || 0) + namespace["counter"];
                        } else {
                            if (processType.includes(":")){
                                var processLabel = processType.split(":")[1];
                                types[processLabel] = (types[processLabel] || 0) + namespace["counter"];
                            } else if (processType.length >= 1) {
                                var functionName = processType.split(".").pop();
                                types[functionName] = (types[functionName] || 0) + namespace["counter"];
                            } else {
                                var processNodeType = processNode.split(".").reverse()[1];
                                types[processNodeType] = (types[processNodeType] || 0) + namespace["counter"];
                            }
                        }
                    }
                }

                return types;
            }


            // get users list
            nodeService.getNodes("USER", "", $scope.profileRestEndPoint).then(function (response) {

                var users= [];
                var displayName;

                $.each(response.data.data.users, function (idx, user) {
                    displayName = user.first_name + " " +  user.last_name;
                    users.push({id: user.id, displayName: displayName,
                        firstName: user.first_name, lastName: user.last_name});
                });

                // sort by last name
                users.sort(function(a, b) {
                    if (a.lastName > b.lastName) {
                        return 1;
                    }
                    if (a.lastName < b.lastName) {
                        return -1;
                    }
                    return 0;
                }).unshift({id: -1, displayName: "everybody", firstName: "", lastName: ""});

                $scope.selectedUser = users[0];
                $scope.users = users;
            });

            //update all plots for give user
            $scope.updateStatistics = function () {
                // delete previous charts
                $.each($scope.charts, function(ckey, cobj){
                    cobj.destroy();
                });
                $scope.isDisplayPlots = true;
                $scope.displayCharts();
            };

            // create/update plots
            $scope.displayCharts = function () {
                $scope.dataLoading = true;
                $scope.timelineLoading = true;
                var subUrl;
                if($scope.selectedUser.displayName !== "everybody")
                    subUrl = '?user=' + $scope.selectedUser.id;

                $scope.displayDataChart = false;
                $scope.displayCalculationsChart = false;
                $scope.displayWorkflowsChart = false;
                $scope.displayNodeChart = false;

                //check if the full_types_count endpoint is available
                nodeService.getServerInfo($scope.selectedProfileInfo.RESTENDPOINT).then(
                    function (response) {
                        if ('API_major_version' in response.data.data) {
                            var restApiMajorVersion = parseInt(response.data.data.API_major_version);
                            var restApiMinorVersion = parseInt(response.data.data.API_minor_version);
                        } else {
                            var restApiVersion = response.data.data[0];
                            var tmp = restApiVersion.length;
                            var restApiMajorVersion = parseInt(restApiVersion.substring(tmp-1, tmp));
                        }
                        if (restApiMajorVersion >= 4 && restApiMinorVersion >= 1) {
                            var dataTypes = {};
                            var calcTypes = {};
                            var workTypes = {};
                            $scope.totalData = 0;
                            $scope.totalCalculations = 0;
                            $scope.totalWorkflows = 0;
                            $scope.dataCharts = {};
                            $scope.workCharts = {};
                            $scope.calcCharts = {};

                            nodeService.getFullTypesStatistics("NODE", $scope.profileRestEndPoint, subUrl).then(function (response) {
                                $scope.dataLoading = false;
                                if(response.data.data.counter > 0) {
                                    $scope.isDisplayPlots = true;
                                    for (var namespace of response.data.data.subspaces) {
                                        if (namespace.full_type.startsWith("data")) {
                                            $scope.totalData = namespace.counter;
                                            dataTypes = countLeaves(namespace, dataTypes);
                                        } else if (namespace.full_type.startsWith("process")) {
                                            for (var processSubspace of namespace.subspaces) {
                                                if (processSubspace.full_type.startsWith("process.calculation")) {
                                                    $scope.totalCalculations = processSubspace.counter;
                                                    calcTypes = countLeaves(processSubspace, calcTypes);
                                                } else if (processSubspace.full_type.startsWith("process.workflow")) {
                                                    $scope.totalWorkflows = processSubspace.counter;
                                                    workTypes = countLeaves(processSubspace, workTypes);
                                                }
                                            }
                                        }
                                    }
                                    if ($scope.totalCalculations > 0) {
                                        $scope.displayCalculationsChart = true;
                                        $scope.calcCharts = graphService.displayFullTypeStatistics("CALCULATIONS", calcTypes, $scope.totalCalculations, $scope.selectedUser.displayName);
                                        graphService.reloadStatisticsGraphs($scope.calcCharts);
                                    }
                                    if ($scope.totalWorkflows > 0) {
                                        $scope.displayWorkflowsChart = true;
                                        $scope.workCharts = graphService.displayFullTypeStatistics("WORKFLOWS", workTypes, $scope.totalWorkflows, $scope.selectedUser.displayName);
                                        graphService.reloadStatisticsGraphs($scope.workCharts);
                                    }
                                    if ($scope.totalData > 0) {
                                        $scope.displayDataChart = true;
                                        $scope.dataCharts = graphService.displayFullTypeStatistics("DATA", dataTypes, $scope.totalData, $scope.selectedUser.displayName);
                                        graphService.reloadStatisticsGraphs($scope.dataCharts);
                                    }
                                } else {
                                    $scope.isDisplayPlots = false;
                                }
                            });

                            $scope.timelineCharts = {};
                            nodeService.getStatistics("NODE", $scope.profileRestEndPoint, subUrl).then(function (response) {
                                $scope.timelineLoading = false;
                                if(response.data.data.total > 0) {
                                    $scope.isDisplayPlots = true;
                                    $scope.timelineCharts = graphService.displayTimelineStatistics("NODE", response, $scope.selectedUser.displayName);
                                    graphService.reloadStatisticsGraphs($scope.timelineCharts);
                                } else {
                                    $scope.isDisplayPlots = false;
                                }
                            });
                        } else {
                            $scope.charts = {};
                            nodeService.getStatistics("NODE", $scope.profileRestEndPoint, subUrl).then(function (response) {
                                $scope.timelineLoading = false;
                                $scope.dataLoading = false;
                                if(response.data.data.total > 0) {
                                    $scope.displayNodeChart = true;
                                    $scope.isDisplayPlots = true;
                                    $scope.charts = graphService.displayExploreStatistics("NODE", response, $scope.selectedUser.displayName);
                                    graphService.reloadStatisticsGraphs($scope.charts);
                                } else {
                                    $scope.isDisplayPlots = false;
                                }
                            });
                        }
                    },
                    function (response) {
                        $scope.charts = {};
                        nodeService.getStatistics("NODE", $scope.profileRestEndPoint, subUrl).then(function (response) {
                            $scope.timelineLoading = false;
                            $scope.dataLoading = false;
                            if(response.data.data.total > 0) {
                                $scope.displayNodeChart = true;
                                $scope.isDisplayPlots = true;
                                $scope.charts = graphService.displayExploreStatistics("NODE", response, $scope.selectedUser.displayName);
                                graphService.reloadStatisticsGraphs($scope.charts);
                            } else {
                                $scope.isDisplayPlots = false;
                            }
                        });
                    }
                );
            };

            // default selected user
            $scope.selectedUser = {id: -1, displayName: "everybody", firstName: "", lastName: ""};
            $scope.displayCharts();

        }
    ]
);