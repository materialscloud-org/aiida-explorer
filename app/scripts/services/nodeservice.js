"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.nodeService
 * @description
 *
 * It is the service used to get node data from server.
 *
 * #### File location: app/scripts/services/nodeservice.js
 *
 * @requires $http : to read data from remote server
 * @requires $rootScope : root scope to broadcast message
 * @requires $q : to defer server response
 * @requires utils : to get REST server end point
 * @requires CONFIG : materials cloud configuration file
 * @requires storageService : to store data in session storage.
 *
 */

angular.module("materialsCloudApp").factory("nodeService",
    ["$http", "$rootScope", "$q", "utils", "CONFIG", "storageService", "messageService",
        function ($http, $rootScope, $q, utils, CONFIG, storageService, messageService) {

            var myService = {

                getServerInfo: function (ProfileRestEndPoint) {
                    // send a get request to the server
                    return $http.get(ProfileRestEndPoint + CONFIG.REST_API.SERVER.BASE)
                        // handle success
                        .then(function successCallback(response) {
                            return response;
                        },
                        // handle error
                        function errorCallback(error) {
                            $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                            return $q.reject(error);
                        });
                },


                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getSchema
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the schema of the node table displayed in Explore section
                 *  from the server.
                 *
                 * @param {string} nodetype type of the node
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getSchema: function(nodeType, ProfileRestEndPoint) {

                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";
                    // send a post request to the server
                    if (nodeType === 'CALCULATION' && restApiVersion === "V4")
                        nodeType = 'CALCULATION_SPECIFIC';
                    return $http.get(ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + CONFIG.REST_API.NODE[restApiVersion]["SCHEMA"])
                        // handle success
                        .then(function success(response) {
                                return response;
                            },
                        // handle error
                        function error(error) {
                            $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                            return $q.reject(error);
                        });
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getUsers
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the users displayed in Explore section
                 *  from the server.
                 *
                 * @param {ProfileRestEndPoint} REST endpoint for the selected profile
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getUsers: function(profileRestEndPoint) {
                    var userDict= {};

                    myService.getNodes("USER", "", profileRestEndPoint).then(
                        // handle success
                        function (response) {
                            var users = response.data.data.users;

                            // add user id as a key in dictionary to make search easy
                            $.each(users, function(index, userDetails) {
                                userDict[userDetails.id] = {
                                    "name": userDetails.first_name + " " + userDetails.last_name,
                                    "institution": userDetails.institution
                                };
                            });
                            storageService.addItem(profileRestEndPoint + "-users", JSON.stringify(userDict));
                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while connecting to server!",
                                CONFIG.MESSAGE_TYPE.ERROR, response);
                        }
                    );

                    return userDict;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getStatistics
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the statistics information for given node type from the server.
                 *
                 * @param {string} nodeType type of the node
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getStatistics: function(nodeType, ProfileRestEndPoint, subUrl) {

                    var deferred = $q.defer();

                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";

                    var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + CONFIG.REST_API.NODE[restApiVersion]["STATISTICS"];

                    if(subUrl !== undefined && subUrl !== "") {
                        url = url + subUrl;
                    }

                    // send a post request to the server
                    $http.get(url)

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getFullTypesStatistics
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the statistics information for node full_types from the server.
                 *
                 * @param {string} nodeType type of the node
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getFullTypesStatistics: function(nodeType, ProfileRestEndPoint, subUrl) {

                    var deferred = $q.defer();

                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";

                    var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + CONFIG.REST_API.NODE[restApiVersion]["FULL_TYPES_STATISTICS"];

                    if(subUrl !== undefined && subUrl !== "") {
                        url = url + subUrl;
                    }

                    // send a post request to the server
                    $http.get(url)

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getNodetypes
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the list of distinct node types from the server.
                 *
                 * @param {string} nodeType type of the node
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getNodetypes: function(nodeType, ProfileRestEndPoint) {
                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";

                    var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + CONFIG.REST_API.NODE[restApiVersion]["NODE_TYPES"];

                    // send a post request to the server
                    return $http.get(url)
                        // handle success
                        .then(function success(response) {
                                return response.data;
                        },
                        // handle error
                        function error(error) {
                            $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                            return $q.reject(error);
                        });
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getDownloadFormats
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the lists of download formats for every node type from the server.
                 *
                 * @param {string} nodeType type of the node
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getDownloadFormats: function(nodeType, ProfileRestEndPoint) {

                    var deferred = $q.defer();
                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";
                    var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + CONFIG.REST_API.NODE[restApiVersion]["DOWNLOAD_FORMATS"];

                    // send a post request to the server
                    $http.get(url)

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getSingleNode
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the data for single node from the server.
                 *
                 * @param {string} nodeType type of the node.
                 * @param {int} nodeId id of the node.
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getSingleNode: function(nodeType, nodeId, ProfileRestEndPoint) {

                    var deferred = $q.defer();
                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";

                    if (nodeType != 'COMPUTER'){
                        nodeType = 'NODE';
                    }

                    if (ProfileRestEndPoint.endsWith('v2') || ProfileRestEndPoint.endsWith('v3')) {
                        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + "/" + nodeId;
                    } else {
                        var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + "/" + nodeId + "?attributes=true";
                    }
                    // send a post request to the server
                    $http.get(url)

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getNodes
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the nodes data from the server.
                 *
                 * @param {string} nodeType type of the node.
                 * @param {string} subUrl part of the url.
                 * @param {object} paramsDict url filters.
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getNodes: function(nodeType, subUrl, ProfileRestEndPoint, paramsDict) {

                    var deferred = $q.defer();

                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";
                    var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType];

                    if(subUrl !== undefined && subUrl !== "") {
                        url = url + subUrl;
                    }
                    if (paramsDict === undefined) {
                        paramsDict = {};
                    }

                    // send a post request to the server
                    $http.get(url, { params: paramsDict })

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getMetadata
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the node metadata from the server.
                 *
                 * @param {string} nodeType type of the node.
                 * @param {int} nodeId id of the node.
                 * @param {string} mtype type of the node metadata.
                 * @param {object} paramsDict url filters.
                 *
                 * @returns {object} deferred promise with server's response.
                 */
                getMetadata: function(nodeType, nodeId, mtype, ProfileRestEndPoint, paramsDict) {

                    if (ProfileRestEndPoint.endsWith("v4"))
                        var restApiVersion = "V4";
                    else if (ProfileRestEndPoint.endsWith("v3"))
                        var restApiVersion = "V3";
                    else
                        var restApiVersion = "V2";
                    var deferred = $q.defer();
                    var url = ProfileRestEndPoint + CONFIG.REST_API.NODE[restApiVersion][nodeType] + "/" + nodeId + CONFIG.REST_API.NODE[restApiVersion][mtype];

                    if (paramsDict === undefined) {
                        paramsDict = {};
                    }

                    // send a post request to the server
                    $http.get(url, { params: paramsDict })

                    // handle success
                        .then(function successCallback(response) {
                                deferred.resolve(response);
                            },

                            // handle error
                            function errorCallback(response) {
                                $rootScope.$broadcast(CONFIG.EVENT_TYPE.NODE.HTTP_FAILURE);
                                deferred.reject(response);
                            });

                    // return promise object
                    return deferred.promise;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.nodeService#getComputers
                 * @methodOf materialsCloudApp.nodeService
                 *
                 * @description
                 *  It gets the list of computers from the server and stores it
                 *  in the session storege.
                 *
                 * @returns {object} list of computers.
                 */
                getComputers: function (profileRestEndPoint) {
                    var computers;

                    myService.getNodes("COMPUTER", "", profileRestEndPoint).then(
                        // handle success
                        function (response) {
                            computers = response.data.data.computers;
                        },
                        // handle error
                        function (response) {
                            messageService.updateMessage("Error while connecting to server!",
                                CONFIG.MESSAGE_TYPE.ERROR, response);
                            computers = [];
                        }
                    );

                    var computerDict= {};
                    // add computer id as a key in dictionary to make search easy
                    $.each(computers, function(index, computerDetails) {
                        computerDict[computerDetails.id] = computerDetails;
                    });

                    return computerDict;
                }
            };

            return myService;

        }
    ]);
