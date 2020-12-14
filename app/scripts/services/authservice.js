'use strict';

/**
 * @ngdoc service
 * @name materialsCloudApp.authService
 * @description
 *
 * This service provides functionality required in authentication process.
 *
 * #### File location: app/scripts/services/authservice.js
 *
 * @requires $q : to defer server response
 * @requires $http : to read data from remote server
 * @requires $cookies : to get/set/remove data from cookies.
 * @requires $rootScope : root scope to broadcast message
 * @requires utils : to get REST server end point
 * @requires CONFIG : materials cloud configuration file
 *
 */

app.config([
	'$httpProvider',
	function ($httpProvider) {
		// $httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = true;
		// $httpProvider.defaults.xsrfCookieName = 'csrftoken';
		// $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
		// delete $httpProvider.defaults.headers.common['X-Requested-With'];
	},
]);

angular.module('materialsCloudApp').factory('authService', [
	'$q',
	'$http',
	'$cookies',
	'$rootScope',
	'utils',
	'CONFIG',

	function ($q, $http, $cookies, $rootScope, utils, CONFIG) {
		/**
		 * @ngdoc
		 * @name materialsCloudApp.authService#user
		 * @propertyOf materialsCloudApp.authService
		 *
		 * @description
		 *  user object
		 */
		var user = null;

		var service = {
			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#isSignedIn
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  This method checks if user session is still valid or user
			 *  is still logged in. It gets the authentication token stored
			 *  in cookies. If token is available, session is still valid or
			 *  uses is still logged in else session is expired/user logged out.
			 *
			 * @returns {boolean} boolean to tell if session is valid or expired
			 * or user is logged in.
			 */
			isSignedIn: function () {
				var tok = $cookies.get(CONFIG.CONSTANT.AUTH.TOKEN);

				if (tok === undefined) {
					$rootScope.$broadcast(CONFIG.EVENT_TYPE.AUTH.TOKEN_EXPIRED);
					return false;
				} else return true;
			},

			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#setUser
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  This method sets the expiry time for user authentication token
			 *  and store it in cookie.
			 *
			 * @returns {undefined} It doesn't return.
			 */
			setUser: function (token) {
				var expiryTime = new Date();
				expiryTime.setHours(
					expiryTime.getHours() + CONFIG.CONSTANT.AUTH.EXPIRY_HOURS
				);
				$cookies.put(CONFIG.CONSTANT.AUTH.TOKEN, token, {
					expires: expiryTime,
				});
			},

			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#resetUser
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  This method resets the user and removes the user authentication token
			 *  stored in the cookie.
			 *
			 * @returns {undefined} It doesn't return.
			 */
			resetUser: function () {
				user = null;
				$cookies.remove(CONFIG.CONSTANT.AUTH.TOKEN);
			},

			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#signin
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  This method sends the user entered username and password to the
			 *  server using REST API and requests the authentication token for this user.
			 *  If user credentials are valid, it receives the success message with
			 *  authentication token. It stores the token in cookie and broadcasts the message.
			 *  If user credentials are not valid, it receives and broadcasts the failure message.
			 *
			 * @param {string} email user email.
			 * @param {string} password user password.
			 *
			 * @returns {object} deferred promise with server's response.
			 */
			signin: function (email, password) {
				var deferred = $q.defer();

				// send a post request to the server
				$http
					.post(
						utils.getRestServerEndpoint() +
							CONFIG.REST_API.AUTH.SIGNIN,
						{ email: email, password: password }
					)

					// handle success
					.then(
						function successCallback(response) {
							console.log(response);
							var token = response.data.response;
							service.setUser(token);
							$rootScope.$broadcast(
								CONFIG.EVENT_TYPE.AUTH.SIGNIN_SUCCESS
							);
							deferred.resolve(response.data);
						},

						// handle error
						function errorCallback(response) {
							$rootScope.$broadcast(
								CONFIG.EVENT_TYPE.AUTH.SIGNIN_FAILURE
							);
							deferred.reject(response);
						}
					);

				// return promise object
				return deferred.promise;
			},

			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#signInAsGuest
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  It works same as signin method and requests token for guest user. Guest user
			 *  is already created on server. So if server call is successful, it receives the guest
			 *  authentication token, stores it in cookie and broadcasts the message.
			 *  If server call fails, it broadcasts the failure message.
			 *
			 * @returns {object} deferred promise with server's response.
			 */
			signInAsGuest: function () {
				var deferred = $q.defer();

				// send a post request to the server
				$http
					.get(
						utils.getRestServerEndpoint() +
							CONFIG.REST_API.AUTH.SIGNIN
					)

					// handle success
					.then(
						function successCallback(response) {
							var token = response.data.response;
							service.setUser(token);
							$rootScope.$broadcast(
								CONFIG.EVENT_TYPE.AUTH.SIGNIN_SUCCESS
							);
							deferred.resolve(response.data);
						},

						// handle error
						function errorCallback(response) {
							$rootScope.$broadcast(
								CONFIG.EVENT_TYPE.AUTH.SIGNIN_FAILURE
							);
							deferred.reject(response);
						}
					);

				// return promise object
				return deferred.promise;
			},

			// TODO: for server connect, remove this later
			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#testSignInAsGuest
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  It makes a test call to the new REST server end point
			 *  to check its availability. It is used in server connect feature.
			 *
			 * @param {string} serverEndpoint new REST server end point.
			 *
			 * @returns {object} deferred promise with server's response.
			 */
			testSignInAsGuest: function (serverEndpoint) {
				var deferred = $q.defer();

				// send a post request to the server
				$http
					.get(serverEndpoint + CONFIG.REST_API.AUTH.SIGNIN)

					// handle success
					.then(
						function successCallback(response) {
							deferred.resolve(response.data);
						},

						// handle error
						function errorCallback(response) {
							deferred.reject(response);
						}
					);
				// return promise object
				return deferred.promise;
			},

			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#signout
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  It resets the user and broadcasts the message.
			 *
			 * @param {string} token authentication token
			 *
			 * @returns {object} deferred promise with server's response.
			 */
			signout: function (token) {
				var self = this;
				var deferred = $q.defer();

				// logout in token based auth is just remove token at client, may need extra handling
				/*
                     $http.post(utils.getRestServerEndpoint() + CONFIG.REST_API.AUTH.SIGNOUT, {email: token})

                     // handle success
                     .then(function successCallback(response) {
                     $rootScope.$broadcast(CONFIG.EVENT_TYPE.AUTH.SIGNOUT_SUCCESS);
                     deferred.resolve();

                     },

                     // handle error
                     function errorCallback(response) {
                     self.resetUser();
                     $rootScope.$broadcast(CONFIG.EVENT_TYPE.AUTH.SIGNOUT_FAILURE);
                     deferred.reject();
                     });
                     */

				setTimeout(function () {
					service.resetUser();
					$rootScope.$broadcast(
						CONFIG.EVENT_TYPE.AUTH.SIGNOUT_SUCCESS
					);
					deferred.resolve();
				}, 200);

				// return promise object
				return deferred.promise;
			},

			/**
			 * @ngdoc
			 * @name materialsCloudApp.authService#signup
			 * @methodOf materialsCloudApp.authService
			 *
			 * @description
			 *  It gets the user entered values from signup form and send them
			 *  to the server to register the user at server side.
			 *
			 * @param {string} email email entered by user
			 * @param {string} password password entered by user.
			 * @param {string} first_name first name entered by user.
			 * @param {string} last_name last name entered by user.
			 * @param {string} institute institute name entered by user.
			 *
			 * @returns {object} deferred promise with server's response.
			 */
			signup: function (
				email,
				password,
				first_name,
				last_name,
				institute
			) {
				// create a new instance of deferred
				var deferred = $q.defer();

				// send a post request to the server
				$http
					.post(
						utils.getRestServerEndpoint() +
							CONFIG.REST_API.AUTH.SIGNUP,
						{
							email: email,
							password: password,
							first_name: first_name,
							last_name: last_name,
							institute: institute,
						}
					)

					// handle success
					.then(
						function successCallback(response) {
							console.log(response);
							$rootScope.$broadcast(
								CONFIG.EVENT_TYPE.AUTH.SIGNUP_SUCCESS
							);
							deferred.resolve({ user: response.data.response });
						},

						// handle error
						function errorCallback(response) {
							$rootScope.$broadcast(
								CONFIG.EVENT_TYPE.AUTH.SIGNUP_FAILURE
							);
							deferred.reject(response);
						}
					);

				// return promise object
				return deferred.promise;
			},
		};

		return service;
	},
]);
