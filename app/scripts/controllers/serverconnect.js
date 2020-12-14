'use strict';

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:ServerconnectCtrl
 * @description
 *
 * It is the main controller used to process commmon information in all
 * node details pages like node tree, basic node information, etc.
 *
 * #### File location: app/scripts/controllers/serverconnect.js
 *
 * @requires $scope : scope object for this page
 * @requires serverConnectService : used to test connection
 * @requires utils : util functionality to create windows/panels
 * @requires CONFIG : materials cloud configuration file
 *
 */

angular.module('materialsCloudApp').controller('ServerconnectCtrl', [
	'$scope',
	'$state',
	'messageService',
	'serverConnectService',
	'utils',
	'CONFIG',

	function (
		$scope,
		$state,
		messageService,
		serverConnectService,
		utils,
		CONFIG
	) {
		/**
		 * @ngdoc
		 * @name materialsCloudApp.controller:ServerconnectCtrl#userRestEndPoint
		 * @propertyOf materialsCloudApp.controller:ServerconnectCtrl
		 *
		 * @description
		 * stores user REST end point.
		 */
		$scope.userRestEndPoint = '';

		$scope.displayUserEndPoint = '';

		/**
		 * @ngdoc
		 * @name materialsCloudApp.controller:ServerconnectCtrl#connectServer
		 * @methodOf materialsCloudApp.controller:ServerconnectCtrl
		 *
		 * @description
		 * It creates the test connection with new user entered REST end point.
		 * If it is successful, updates the REST end point for application else
		 * displays the error message using messageService.
		 *
		 * @returns {undefined} It doesn't return.
		 */
		$scope.connectServer = function () {
			if ($scope.connectForm.serverendpoint.$valid) {
				$scope.checkServerUp($scope.userRestEndPoint, true);
			} else {
				messageService.updateMessage(
					'Invalid URL pattern [should be http://ip_or_hostname/api/etc]!',
					CONFIG.MESSAGE_TYPE.ERROR
				);
			}
		};

		$scope.checkServerUp = function (endpoint, redirect) {
			serverConnectService
				.testServer(endpoint)
				// handle success
				.then(
					function (data) {
						$scope.setServerEndPoint(endpoint);
						$scope.displayUserEndPoint = endpoint;
						if ($scope.userRestEndPoint.length == 0)
							$scope.userRestEndPoint = endpoint;
						messageService.updateMessage(
							'Configured your server REST endpoint!',
							CONFIG.MESSAGE_TYPE.SUCCESS
						);
						if (redirect) $scope.exploreData();
					},

					// handle error
					function (response) {
						messageService.updateMessage(
							'Error while connecting to new REST endpoint!',
							CONFIG.MESSAGE_TYPE.ERROR,
							response
						);
					}
				);
		};

		$scope.exploreData = function () {
			$state.go('main.explore.dashboard', {
				selectedProfile: 'ownrestapi',
			});
		};

		/**
		 * @ngdoc
		 * @name materialsCloudApp.controller:ServerconnectCtrl#resetServer
		 * @methodOf materialsCloudApp.controller:ServerconnectCtrl
		 *
		 * @description
		 * It resets the REST end point to default one for application.
		 *
		 * @returns {undefined} It doesn't return.
		 */
		$scope.resetServer = function () {
			utils.resetRestServerEndpoint();
			messageService.updateMessage(
				'Reset to default REST endpoint!',
				CONFIG.MESSAGE_TYPE.SUCCESS
			);
		};

		/**
		 * @ngdoc
		 * @name materialsCloudApp.controller:ServerconnectCtrl#getServerEndpoint
		 * @methodOf materialsCloudApp.controller:ServerconnectCtrl
		 *
		 * @description
		 * It gets the default server REST end point from utils service and
		 * returns it.
		 *
		 * @returns {string} default server REST end point.
		 */
		$scope.getServerEndpoint = function () {
			return utils.getUserServerEndpoint();
		};

		/**
		 * @ngdoc
		 * @name materialsCloudApp.controller:ServerconnectCtrl#setServerEndPoint
		 * @methodOf materialsCloudApp.controller:ServerconnectCtrl
		 *
		 * @description
		 * It sets the user entered server REST end point for application
		 * using utils service.
		 *
		 * @param {string} server user entered server REST end point.
		 *
		 * @returns {undefined} It doesn't return.
		 */
		$scope.setServerEndPoint = function (server) {
			utils.setUserServerEndpoint(server);
		};

		var endpoint = $scope.getServerEndpoint();
		if (endpoint) {
			$scope.checkServerUp(endpoint, false);
		}
	},
]);
