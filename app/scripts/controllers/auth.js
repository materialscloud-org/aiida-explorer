'use strict';

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:AuthCtrl
 * @description
 *
 * It is the main controller used to handle authentication processes.
 *
 * #### File location: app/scripts/controllers/auth.js
 *
 * @requires $scope : scope object for this page
 * @requires $state : to change the state url
 * @requires authService : used to authentication
 * @requires messageService : service used to display status/error messages
 * @requires CONFIG : materials cloud configuration file
 *
 */

angular.module("materialsCloudApp").controller('AuthCtrl',
    ["$scope", "$state", "authService", "messageService", "CONFIG",
        function ($scope, $state, authService, messageService, CONFIG) {

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#signin_visible
             * @propertyOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * stores boolean to display signin dialog box.
             */
            $scope.signin_visible;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#signout_visible
             * @propertyOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * stores boolean to display signup dialog box.
             */
            $scope.signout_visible;

            if (!authService.isSignedIn()){
                $scope.signin_visible = true;
                $scope.signout_visible = false;
            }
            else {
                $scope.signin_visible = false;
                $scope.signout_visible = true;
            }

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#accept
             * @propertyOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * It stores the boolean to accept terms and conditions for signup.
             * If it is false, user will be redirected back to the signup page
             * else registration process will be continued.
             */
            $scope.accept = false;

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#signin
             * @methodOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * It is called on signin form submission. It uses the authService
             * to validate user email and password with server. If validation
             * is successful, user will be redirected to the materials cloud
             * home page else login failed message will be displayed using
             * messageService.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.signin = function () {

                // call login from service
                authService.signin($scope.loginForm.email, $scope.loginForm.password)
                // handle success
                    .then(function (data) {
                            messageService.updateMessage("Successfully Logged In!", CONFIG.MESSAGE_TYPE.SUCCESS);
                            if($state.params['next'] !== undefined){
                                // revert effect of $scope.$on(SIGNIN_SUCCESS... (see below)
                                $scope.signin_visible = true;
                                window.location.href = $state.params['next'];
                            }else{
                                $state.go('main.home');
                            }
                        },

                        // handle error
                        function (response) {
                            messageService.updateMessage("Login Failed!", CONFIG.MESSAGE_TYPE.ERROR, response);
                        });
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#signin_as_guest
             * @methodOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * It uses the authService to validate guest account authentication
             * with the server. If validation is successful, user will be redirected
             * to the materials cloud home page else login failed message will
             * be displayed using messageService.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.signin_as_guest = function () {

                // call login from service
                authService.signInAsGuest()
                // handle success
                    .then(function (data) {
                            var token = data.response;
                            messageService.updateMessage("Successfully Logged In As Guest!", CONFIG.MESSAGE_TYPE.SUCCESS);
                            $state.go('main.home');
                        },

                        // handle error
                        function (response) {
                            messageService.updateMessage("Login Failed!", CONFIG.MESSAGE_TYPE.ERROR, response);
                        });
            };


            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#signup
             * @methodOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * It is called on signup form submission. It checks if user has
             * accepted the terms and conditions for registration. If yes, it
             * continues the registration process using authService and creates the
             * account for user on server. If user did not accept the terms and
             * conditions, this method redirects user back to the signup page.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.signup = function () {

                // initial values
                $scope.error = false;

                if(!$scope.accept) {
                    messageService.updateMessage("Accept terms and condition!", CONFIG.MESSAGE_TYPE.ERROR);
                    return;
                }

                // call login from service
                authService.signup($scope.signupForm.email, $scope.signupForm.password, $scope.signupForm.firstname, $scope.signupForm.lastname, $scope.signupForm.institute)

                // handle success
                    .then(function (data) {
                            messageService.updateMessage("Successfully Registered Account, Please Sign In!", CONFIG.MESSAGE_TYPE.SUCCESS);
                            $scope.signin_visible = true;
                        },

                        // handle error
                        function (response) {
                            //$scope.loginForm = {};
                            messageService.updateMessage("Account Registration Failed!", CONFIG.MESSAGE_TYPE.ERROR, response);
                        });
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#signout
             * @methodOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * It log outs the current logged in user.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.signout = function () {

                // call login from service
                authService.signout()

                // handle success
                    .then(function () {
                            messageService.updateMessage("Successfully Logged Out!", CONFIG.MESSAGE_TYPE.SUCCESS);
                            $scope.signin_visible = true;
                            $state.go('main.signin');
                        },

                        // handle error
                        function () {
                            messageService.updateMessage("Error while Log Out!", CONFIG.MESSAGE_TYPE.ERROR, response);
                        });
            };

            $scope.validationValidHandler = function(message){
                //any validation success handling
            };

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:AuthCtrl#validationInvalidHandler
             * @methodOf materialsCloudApp.controller:AuthCtrl
             *
             * @description
             * This event is called if any user input is invalid.
             * It displays the error message using messageService.
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.validationInvalidHandler = function(message){
                //invalid callback
                messageService.updateMessage("Please check your input!", CONFIG.MESSAGE_TYPE.ERROR);
            };

            $scope.$on(CONFIG.EVENT_TYPE.AUTH.SIGNIN_SUCCESS, function (event, arg) {
                $scope.signout_visible = true;
                $scope.signin_visible = false;
            });

            $scope.$on(CONFIG.EVENT_TYPE.AUTH.SIGNOUT_SUCCESS, function (event, arg) {
                $scope.signout_visible = false;
                $scope.signin_visible = true;
            });

            $scope.$on(CONFIG.EVENT_TYPE.AUTH.TOKEN_EXPIRED, function (event, arg) {
                $scope.signout_visible = false;
                $scope.signin_visible = true;
                messageService.updateMessage("No active session, Please login!", CONFIG.MESSAGE_TYPE.ERROR);
            });

        }

    ]);