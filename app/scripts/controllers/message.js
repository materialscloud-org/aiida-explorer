'use strict';

/**
 * @ngdoc controller
 * @name materialsCloudApp.controller:MessageCtrl
 * @description
 *
 * It is the controller for displaying status/error messages on top of the page.
 *
 * #### File location: app/scripts/controllers/message.js
 *
 * @requires $scope : scope object for this page
 * @requires messageService : service to get/set all the messages
 *
 */
angular.module("materialsCloudApp").controller('MessageCtrl',
    ["$scope", "messageService",
        function ($scope, $messageService) {

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:MessageCtrl#message_text
             * @propertyOf materialsCloudApp.controller:MessageCtrl
             *
             * @description
             *  It contains the message text received from message service.
             */
            $scope.message_text = $messageService.getMessage();

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:MessageCtrl#message_type
             * @propertyOf materialsCloudApp.controller:MessageCtrl
             *
             * @description
             * It contains the message type received from message service.
             */
            $scope.message_type = $messageService.getType();

            /**
             * @ngdoc
             * @name materialsCloudApp.controller:MessageCtrl#$on
             * @methodOf materialsCloudApp.controller:MessageCtrl
             *
             * @description
             * It updates the message text and type on update event.
             *
             * @param {event} event event name
             * @param {string} message message text
             * @param {string} kind message type
             *
             * @returns {undefined} It doesn't return.
             */
            $scope.$on('message:update', function(event, message, kind) {

                $scope.message_text = message;
                $scope.message_type = kind;

                $("#mcloud-alert").finish();
                $("#mcloud-alert").fadeTo(2000, 500).slideUp(500, function () {
                    // reset again
                    $messageService.resetMessage();
                    $scope.message_text = $messageService.getMessage();
                    $scope.message_type = $messageService.getType();
                });

            });

        }
    ]);
