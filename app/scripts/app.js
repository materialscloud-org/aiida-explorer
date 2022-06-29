"use strict";

/**
 * @ngdoc overview
 * @name materialsCloudApp
 * @description
 *
 * It is a main module of the application.
 *
 * It contains:
 *      - list of dependent modules
 *      - state urls
 *      - application level configurations
 *
 * #### File location: app/scripts/app.js
 */
var app = angular.module("materialsCloudApp", [
    "ngAnimate",
    "config",
    "ngCookies",
    "ngResource",
    "ngRoute",
    "ngSanitize",
    "ngTouch",
    "ui.router",
    "kendo.directives",
    "angular-loading-bar",
    "ngAnimate",
    "ngCookies",
    "validation",
    "validation.rule",
    "LocalStorageModule",
    "jsonFormatter",
    "ngTable",
    "ncy-angular-breadcrumb",
    "ngMaterial",
    "ui.router.title",
    "oc.lazyLoad"
]);


/**
 * @ngdoc object
 * @name materialsCloudApp_Navigation
 * @description
 *
 * This is the Materials Cloud main navigation menu.
 *
 * It contains all the states information and its corresponding urls and templates. If the state is not exist, it redirects to the home page.
 * The html5mode is true for materials cloud application. It means angular will not add "#" in the urls.
 *
 *      - EXPLORE: /explore
 *          - Calculations: /explore/calculations
 *          - Data: /explore/data
 *          - Codes: /explore/codes
 *          - Computers: /explore/computers
 *          - Details: /explore/details/(nodeID)?(nodeType)
 *
 **/


app.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", "$provide",
    "$httpProvider", "cfpLoadingBarProvider", "$validationProvider", "$breadcrumbProvider",
    "$mdThemingProvider", "$compileProvider", "$ocLazyLoadProvider",
    function ($urlRouterProvider, $stateProvider, $locationProvider, $provide,
              $httpProvider, cfpLoadingBarProvider, $validationProvider, $breadcrumbProvider,
              $mdThemingProvider, $compileProvider, $ocLazyLoadProvider) {

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

        // global handler for sign-in and sign-up forms
        angular.extend($validationProvider, {
            validCallback: function (element){
                $(element).parents(".input-group:first").removeClass("has-error");
                $(element).parents(".form-group:first").removeClass("has-error");
                //$(element).parents('.input-group:first').addClass('has-success');
            },
            invalidCallback: function (element) {
                $(element).parents(".input-group:first").addClass("has-error");
                $(element).parents(".form-group:first").addClass("has-error");
                //$(element).parents('.input-group:first').removeClass('has-success');
            }
        });

        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.xsrfCookieName = "csrftoken";
        $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
        delete $httpProvider.defaults.headers.common["X-Requested-With"];

        $breadcrumbProvider.setOptions({
            prefixStateName: "main",
            template: "bootstrap3"
        });

        // no signin-signup messages
        $validationProvider.showSuccessMessage = false;
        $validationProvider.showErrorMessage = false;

        // Material design color palette
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue');

        //Config For ocLazyLoading
        $ocLazyLoadProvider.config({
            'debug': false, // For debugging 'true/false'
            'events': false, // For Event 'true/false'
            "serie": true // If true modules load serially. For each module file loads parallelly if serie:true is not defined explicitly
        });

        $stateProvider
            .state("main", {
                templateUrl: "views/main.html",
                redirectTo: "main.explore",
                abstract: true,
                ncyBreadcrumb: {
                    label: "Home"
                },
                resolve: {
                    $title: function() { return 'Home'; },
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/controllers/main.js',
                            'scripts/controllers/auth.js']); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.serverconnect", {
                url: "/connect",
                templateUrl: "views/serverconnect.html",
                ncyBreadcrumb: {
                    label: "Connect to your server"
                },
                resolve: {
                    $title: function() { return 'Connect to your server'; },
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name : 'ServerconnectCtrl',
                            files: ['scripts/services/serverconnectservice.js',
                                'scripts/controllers/serverconnect.js'],
                            serie: true
                        }]); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.explore", {
                url: "^/",
                templateUrl: "views/explore/explore.html",
                redirectTo: "main.explore.menu",
                ncyBreadcrumb: {
                    label: "Explore"
                },
                resolve: {
                    $title: function() { return 'Explore'; },
                    loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/services/nodeservice.js',
                            'scripts/services/nodevisualization.js',
                            'scripts/services/graphservice.js',
                            'scripts/services/serverconnectservice.js',
                            'scripts/external/jquery.timeago.js',
                            'scripts/directives/bindHtmlCompile.js'
                        ]); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.explore.help", {
                url: "^/help",
                templateUrl: "views/explore/new_tool_help.html",
                ncyBreadcrumb: {
                    label: "Help"
                },
                resolve: {
                    $title: function() { return 'Add new EXPLORE section'; }
                }
            })
            .state("main.explore.menu", {
                url: "^/menu",
                templateUrl: "views/explore/menu.html",
                controller: function($scope, $stateParams, ENV, PROFILES) {
                    $scope.logosUrl = ENV['logosUrl'];
                    $scope.menuProfiles = PROFILES;
                },
                ncyBreadcrumb: {
                    //label: "Selection page"
                    skip: true
                },
                resolve: {
                    // Dynamic title appending to parent state's title
                    $title: ['$title', function($title) {
                        return $title;
                    }]
                }
            })
            .state("main.explore.dashboard", {
                url: "^/:selectedProfile?base_url",
                templateUrl: "views/explore/dashboard.html",
                controller: function($scope, $stateParams, $state, $window, utils, nodeService, messageService, CONFIG, serverConnectService) {

                    $scope.selectedProfile = $stateParams.selectedProfile;

                    function gotoPage(){

                        var currentState = $state.current.name;
                        var statetogo = "";

                        $scope.selectedProfileDisplayName = $scope.selectedProfileInfo.TITLE;
                        $scope.profileRestEndPoint = $scope.selectedProfileInfo.RESTENDPOINT;
                        $scope.typeColumnName = CONFIG.GRID["FILTERS_" + $scope.selectedProfileInfo.REST_API_MAJOR_VERSION.toUpperCase()]["TYPE_COLUMN_NAME"];

                        if (currentState === "main.explore.dashboard.statistics"){
                            $scope.selectedView = "statisticsView";
                            statetogo = "main.explore.dashboard.statistics";
                        }
                        else if (currentState.indexOf("main.explore.dashboard.details") >= 0){
                            $scope.selectedView = "detailsView";
                            if (currentState == "main.explore.dashboard.details")
                                statetogo = "main.explore.dashboard.details";
                            else
                                statetogo = currentState;
                        }
                        else if (currentState.indexOf("main.explore.dashboard.grid") >= 0 || currentState === "main.explore.dashboard"){
                            $scope.selectedView = "gridView";

                            if (currentState === "main.explore.dashboard" || currentState == "main.explore.dashboard.grid")
                                statetogo = "main.explore.dashboard.grid";
                            else
                                statetogo = currentState;
                        }

                        $scope.$broadcast('RestApiVersionReady');
                        $state.go(statetogo);
                    }

                    function setApiVersion(endpoint){
                        var restApiMajorVersion = "";
                        var restApiMinorVersion = "";
                        if(endpoint !== undefined && endpoint.length > 0) {
                            nodeService.getServerInfo(endpoint).then(
                                function (response) {
                                    if ('API_major_version' in response.data.data) {
                                        restApiMajorVersion = 'v' + response.data.data.API_major_version;
                                        restApiMinorVersion = parseInt(response.data.data.API_minor_version);
                                    } else {
                                        var restApiVersion = response.data.data[0];
                                        var tmp = restApiVersion.length;
                                        restApiMajorVersion = restApiVersion.substring(tmp-2, tmp);
                                    }
                                    $scope.selectedProfileInfo = {
                                        RESTENDPOINT: endpoint, TITLE: "Your AiiDA profile (url:" + endpoint + ")",
                                        "REST_API_MAJOR_VERSION": restApiMajorVersion,
                                        "REST_API_MINOR_VERSION": restApiMinorVersion
                                    };
                                    gotoPage();
                                },
                                function (response) {
                                    restApiMajorVersion = "v2";
                                    $scope.selectedProfileInfo = {
                                        RESTENDPOINT: endpoint, TITLE: "Your AiiDA profile (url:" + endpoint + ")",
                                        "REST_API_MAJOR_VERSION": restApiMajorVersion,
                                        "REST_API_MINOR_VERSION": restApiMinorVersion
                                    };
                                    gotoPage();
                                }
                            );
                        }
                        else {
                            $state.go("main.serverconnect", {}, {reload: true});
                            return;
                        }
                    }

                    if($scope.selectedProfile == "ownrestapi"){
                        var endpoint = "";
                        var baseUrl = $state.params.base_url;
                        if (baseUrl) {
                            if(utils.isUrlValid(baseUrl)) {
                                serverConnectService.testServer(baseUrl)
                                // handle success
                                    .then(function (data) {
                                            utils.setUserServerEndpoint(baseUrl);
                                            messageService.updateMessage("Configured your server REST endpoint!", CONFIG.MESSAGE_TYPE.SUCCESS);
                                        setApiVersion(baseUrl);
                                        },

                                        // handle error
                                        function (response) {
                                            messageService.updateMessage("Error while connecting to new REST endpoint!", CONFIG.MESSAGE_TYPE.ERROR, response);
                                        });

                            }
                            else
                                messageService.updateMessage("base_url (URL) parameter value is not a valid URL format!",
                                    CONFIG.MESSAGE_TYPE.ERROR);
                        }
                        else {
                            endpoint = utils.getUserServerEndpoint();
                            if (endpoint)
                                setApiVersion(endpoint);
                            else {
                                $state.go("main.serverconnect");
                            }
                        }

                    }
                    else {
                        $scope.selectedProfileInfo = utils.getExploreProfileInfo($scope.selectedProfile);
                        gotoPage();
                    }
                },
                ncyBreadcrumb: {
                    //label: "{{selectedProfileDisplayName}}"
                    skip: true
                },
                resolve: {
                    getSelectedProfile: ['$stateParams', 'PROFILES', function($stateParams, PROFILES) {
                        if($stateParams.selectedProfile == "ownrestapi")
                            return { selectedProfile: "Your AiiDA REST API"};
                        else
                            return { selectedProfile: PROFILES[$stateParams.selectedProfile]["TITLE"] };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['$title', 'getSelectedProfile', function($title, getSelectedProfile) {
                        return $title + " - " + getSelectedProfile.selectedProfile;
                    }]
                }
            })
            .state("main.explore.dashboard.grid", {
                url: "/grid",
                templateUrl: "views/explore/gridview.html",
                redirectTo: "main.explore.dashboard.grid.calculations",
                ncyBreadcrumb: {
                    //label: "Grid"
                    skip: true
                },
                resolve: {
                    // Dynamic title appending to parent state's title
                    $title: ['$title', function($title) {
                        return $title + " Table";
                    }],
                    loadMyCtrl: ['loadMyService', '$ocLazyLoad', function(loadMyService, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                name : 'ExploreGridView',
                                files: [
                                    'scripts/services/tableservice.js',
                                    'scripts/directives/dnodetable.js',
                                    'scripts/controllers/explore/gridview.js',
                                    'scripts/controllers/explore/basenodeview.js'
                                ],
                                serie: true
                            }
                        ]); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.explore.dashboard.grid.computers", {
                url: "/computers",
                templateUrl: "views/explore/computers.html",
                params: {
                    nodeType: "COMPUTER",
                    nodeFilter: ""
                },
                ncyBreadcrumb: {
                    label: "Computers"
                },
                resolve: {
                    getSelectedProfile: ['$stateParams', 'PROFILES', function($stateParams, PROFILES) {
                        if($stateParams.selectedProfile == "ownrestapi")
                            return { selectedProfile: "Your AiiDA REST API"};
                        else
                            return { selectedProfile: PROFILES[$stateParams.selectedProfile]["TITLE"] };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getSelectedProfile', function(getSelectedProfile) {
                        return "Computers from " + getSelectedProfile.selectedProfile + " profile";
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/controllers/explore/computers.js']); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.explore.dashboard.grid.calculations", {
                url: "/calculations",
                templateUrl: "views/explore/calculations.html",
                ncyBreadcrumb: {
                    label: "Calculations"
                },
                params: {
                    nodeType: "CALCULATION",
                    nodeFilter: ""
                },
                resolve: {
                    getSelectedProfile: ['$stateParams', 'PROFILES', function($stateParams, PROFILES) {
                        if($stateParams.selectedProfile == "ownrestapi")
                            return { selectedProfile: "Your AiiDA REST API"};
                        else
                            return { selectedProfile: PROFILES[$stateParams.selectedProfile]["TITLE"] };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getSelectedProfile', function(getSelectedProfile) {
                        return "Calculations from " + getSelectedProfile.selectedProfile + " profile";
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/controllers/explore/calculations.js']); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.explore.dashboard.grid.data", {
                url: "/ndata",
                templateUrl: "views/explore/datanodes.html",
                params: {
                    nodeType: "DATA",
                    nodeFilter: ""
                },
                ncyBreadcrumb: {
                    label: "Data"
                },
                resolve: {
                    getSelectedProfile: ['$stateParams', 'PROFILES', function($stateParams, PROFILES) {
                        if($stateParams.selectedProfile == "ownrestapi")
                            return { selectedProfile: "Your AiiDA REST API"};
                        else
                            return { selectedProfile: PROFILES[$stateParams.selectedProfile]["TITLE"] };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getSelectedProfile', function(getSelectedProfile) {
                        return "Data nodes from " + getSelectedProfile.selectedProfile + " profile";
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/controllers/explore/datanodes.js']); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.explore.dashboard.grid.codes", {
                url: "/codes",
                templateUrl: "views/explore/codes.html",
                params: {
                    nodeType: "CODE",
                    nodeFilter: ""
                },
                ncyBreadcrumb: {
                    label: "Codes"
                },
                resolve: {
                    getSelectedProfile: ['$stateParams', 'PROFILES', function($stateParams, PROFILES) {
                        if($stateParams.selectedProfile == "ownrestapi")
                            return { selectedProfile: "Your AiiDA REST API"};
                        else
                            return { selectedProfile: PROFILES[$stateParams.selectedProfile]["TITLE"] };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getSelectedProfile', function(getSelectedProfile) {
                        return "Codes used in " + getSelectedProfile.selectedProfile + " profile";
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['scripts/controllers/explore/codes.js']); // Resolve promise and load before view
                    }]
                }
            })
            // node details
            .state("main.explore.dashboard.details", {
                url: "/details",
                templateUrl: "views/explore/detailsview.html",
                controller: function($scope, $stateParams, utils, $state) {
                    $scope.nodeUuid;
                    $scope.$parent.selectedView = "detailsView";
                    $scope.displayBasicDetails = false;
                    $scope.displayBasicNodeDetails = false;
                    $scope.defaultAttributes;

                    function gotopage() {
                        if($state.current.name === "main.explore.dashboard.details.viewnode"){
                            $state.go("main.explore.dashboard.details.viewnode");
                        }
                    }

                    if($scope.selectedProfileInfo)
                        gotopage();

                    $scope.$on("RestApiVersionReady", function(event) {
                        gotopage();
                    });

                },
                ncyBreadcrumb: {
                    label: "Node details"
                },
                resolve: {
                    getSelectedProfile: ['$stateParams', 'PROFILES', function($stateParams, PROFILES) {
                        if($stateParams.selectedProfile == "ownrestapi")
                            return { selectedProfile: "Your AiiDA REST API"};
                        else
                            return { selectedProfile: PROFILES[$stateParams.selectedProfile]["TITLE"] };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getSelectedProfile', function(getSelectedProfile) {
                        return getSelectedProfile.selectedProfile + " profile details view";
                    }],
                    loadMyCtrl: ['loadMyService', '$ocLazyLoad', function(loadMyService, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/filters/replaceunderscoreandcapitalize.js',
                            {
                                name : 'ExploreDetailsView',
                                files: [
                                    // computer
                                    'scripts/controllers/explore/nodedetails/computer.js',
                                    // calculation
                                    'scripts/controllers/filedialog.js',
                                    'scripts/controllers/explore/nodedetails/process/inline.js',
                                    'scripts/controllers/explore/nodedetails/process/calcjob.js',
                                    'scripts/controllers/explore/nodedetails/process/workchain.js',
                                    //data
                                    'scripts/controllers/explore/nodedetails/data/kpoint.js',
                                    'scripts/controllers/explore/nodedetails/data/cif.js',
                                    'scripts/controllers/explore/nodedetails/data/structure.js',
                                    'scripts/controllers/explore/nodedetails/data/band.js',
                                    'scripts/controllers/explore/nodedetails/data/upf.js'
                                ]
                            },
                            'scripts/directives/bindHtmlCompile.js',
                            'scripts/directives/jsmolviz.js',
                            'scripts/controllers/explore/nodedetails/provenance.js',
                            'scripts/controllers/explore/nodedetails/nodeDetails.js'
                        ]); // Resolve promise and load before view
                    }]
                }
            })
            .state("main.explore.dashboard.details.viewnode", {
                url: "/:nodeId?nodeType",
                templateUrl: "views/explore/nodedetails/nodedetails.html",
                controller: "NodeDetailsCtrl",
                params: {
                    nodeId: "",
                    nodeType: "NODE"
                },
                ncyBreadcrumb: {
                    label: "{{nodeId}} - {{paramNodeType}}"
                },
                resolve: {
                    getNodeId: ['$stateParams', function($stateParams) {
                        return { nodeId: $stateParams.nodeId };
                    }],
                    getNodeType: ['$stateParams', function($stateParams) {
                        return { nodeType: $stateParams.nodeType };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getNodeId', 'getNodeType', function(getNodeId, getNodeType) {
                        return getNodeId.nodeId + " (" + getNodeType.nodeType + ")";
                    }]
                }
            })
            .state("main.explore.dashboard.statistics", {
                url: "/statistics",
                templateUrl: "views/explore/statisticsview.html",
                ncyBreadcrumb: {
                    label: "Statistics"
                },
                resolve: {
                    getSelectedProfile: ['$stateParams', 'PROFILES', function($stateParams, PROFILES) {
                        if($stateParams.selectedProfile == "ownrestapi")
                            return { selectedProfile: "Your AiiDA REST API"};
                        else
                            return { selectedProfile: PROFILES[$stateParams.selectedProfile]["TITLE"] };
                    }],
                    // Dynamic title appending to parent state's title
                    $title: ['getSelectedProfile', function(getSelectedProfile) {
                        return getSelectedProfile.selectedProfile + " statistics";
                    }],
                    loadMyCtrl: ['loadMyService', '$ocLazyLoad', function(loadMyService, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                name : 'ExploreDetailsView',
                                files: [
                                    'scripts/external/highstock.min.js',
                                    'scripts/controllers/explore/statisticsview.js'
                                ],
                                serie: true
                            }
                        ]); // Resolve promise and load before view
                    }]
                }
            })
            /* 404 page*/
            .state("main.pagenotfound", {
                url: "/pagenotfound",
                templateUrl: "views/custom404.html",
                resolve: {
                    $title: function() { return 'Page not found'; }
                }
            });

        $urlRouterProvider.otherwise("/pagenotfound");

        $urlRouterProvider.rule(function($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length-1] === '/';

            if(hasTrailingSlash) {

                //if last charcter is a slash, return the same url without the slash
                var newPath = path.substr(0, path.length - 1);
                return newPath;
            }

        });

        // use the HTML5 History API
        $locationProvider.html5Mode(true).hashPrefix('!');

        // for network loading bar
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.parentSelector = ".mcloud-status-bar";

        // Intercept http calls, @todo: for future use
        $provide.factory("customHttpInterceptor", function ($q) {
            return {
                // On request success
                request: function (config) {
                    // Return the config or wrap it in a promise if blank.
                    return config || $q.when(config);
                },

                // On request failure
                requestError: function (rejection) {
                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response success
                response: function (response) {
                    // Return the response or promise.
                    return response || $q.when(response);
                },

                // On response failture
                responseError: function (rejection) {
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        });

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push("customHttpInterceptor");

    }
])
    .run(["$rootScope", "$state", function($rootScope, $state) {

        /* When state/url changes it runs this code */
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

            $(toState).addClass("NewClass");
            $(fromState).removeClass("NewClass");

            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo, {}, {"location": "replace"});
            }

        });

        // $rootScope.$on("$stateChangeSuccess", function(event) {
        //     window.ga('send', 'pageview', window.location.pathname);
        // });

    }]);


function loadProfileConfig () {
    // loading angular injector to retrieve the $http service
    var ngInjector = angular.injector(["ng"]);
    var $http = ngInjector.get("$http");

    var mcloudConfig = angular.injector(["ng", "config"]).get("ENV");
    var profilesUrl = mcloudConfig.profilesUrl;

    return $http.get(profilesUrl).then(function(response) {
        var profiles = {};
        response.data.profiles.forEach(function (profile, index) {
            profiles[profile["profile"]] = {
                "REST_URL": profile.rest_url,
                "TITLE": profile.title,
                "LOGO": profile.logo,
                "AUTHORS": profile.authors,
                "DESCRIPTION": profile.description,
                "ARCHIVE_ENTRY_DOI": profile.doi,
                "ARCHIVE_ENTRY_DOIS": profile.dois,
                "REST_API_MAJOR_VERSION": profile.rest_url.slice(-2)
            };
        });
        app.constant("PROFILES", profiles);
    },
    function(err) {
        console.error("Error loading the application environment.", err)
    });
}

// manually bootstrap the angularjs app in the root document
function bootstrapApplication() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["materialsCloudApp"]);
    });
}

// load the environment and declare it to the app
// then bootstraps the app starting the application
loadProfileConfig().then(bootstrapApplication);
