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

angular.module('materialsCloudApp').factory('serverConnectService', [
	'$q',
	'$http',
	'$cookies',
	'$rootScope',
	'utils',
	'CONFIG',

	function ($q, $http, $cookies, $rootScope, utils, CONFIG) {
		var service = {
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
			testServer: function (serverEndpoint) {
				// $http.defaults.headers.common.Authorization =
				// 'Basic YWRtaW46NTQzMjE=';

				var req = {
					method: 'GET',
					// url: 'http://135.181.145.250:18080/api/v4/server',
					url: serverEndpoint + CONFIG.REST_API.SERVER.BASE,
					headers: {
						Authorization: 'Basic YWRtaW46NTQzMjE=',
						// Origni: serverEndpoint + CONFIG.REST_API.SERVER.BASE,
					},
				};

				var deferred = $q.defer();

				// send a post request to the server
				$http(req)
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
		};

		return service;
	},
]);
