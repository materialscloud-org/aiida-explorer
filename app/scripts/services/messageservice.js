'use strict';

/**
 * @ngdoc service
 * @name materialsCloudApp.messageService
 * @description
 *
 * This is a messaging service of the materials cloud. It broadcasts the
 * message on top of the page.
 *
 * #### File location: app/scripts/services/messageservice.js
 *
 * @requires $rootScope : root scope of the materials cloud application.
 * @requires CONFIG : materials cloud configuration file.
 *
 */

app.factory("messageService",
    ["$rootScope", "CONFIG",

        function ($rootScope, CONFIG) {

            /**
             * @ngdoc
             * @name materialsCloudApp.messageService#message
             * @propertyOf materialsCloudApp.messageService
             *
             * @description
             *  broadcasted message.
             */
            var message = "";

            /**
             * @ngdoc
             * @name materialsCloudApp.messageService#type
             * @propertyOf materialsCloudApp.messageService
             *
             * @description
             *  type of the broadcasted message.
             */
            var type = CONFIG.MESSAGE_TYPE.INFO;

            var service = {

                /**
                 * @ngdoc
                 * @name materialsCloudApp.messageService#updateMessage
                 * @methodOf materialsCloudApp.messageService
                 *
                 * @description
                 *  This method checks the status of the response, get the type
                 *  of the message and broadcasts the message using root scope.
                 *
                 * @param {string} text message text.
                 * @param {string} kind message type.
                 * @param {object} response server response is any.
                 *
                 * @returns {undefined} It doesn't return.
                 */
                updateMessage: function (text, kind, response) {
                    message = text;
                    type = kind;

                    if(response != null) {
                        if(response.status == -1) {
                            message += " [Network Connection Error]";
                        } else if(response.status == 401) {
                            message += " [Unauthorized Access]";
                        }

                        if(response.data && response.data.hasOwnProperty('response')){
                            message += " [" + response.data.response + "]"
                        }
                    }

                    $rootScope.$broadcast('message:update', message, type);
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.messageService#resetMessage
                 * @methodOf materialsCloudApp.messageService
                 *
                 * @description
                 *  It resets the message text and type with empty string.
                 *
                 * @returns {undefined} It doesn't return.
                 */
                resetMessage: function() {
                    message = "";
                    type = "";
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.messageService#getMessage
                 * @methodOf materialsCloudApp.messageService
                 *
                 * @description
                 *  to get the broadcasted message.
                 *
                 * @returns {string} broadcasted message.
                 */
                getMessage: function () {
                    return message;
                },

                /**
                 * @ngdoc
                 * @name materialsCloudApp.messageService#getType
                 * @methodOf materialsCloudApp.messageService
                 *
                 * @description
                 *  to get the type of the broadcasted message.
                 *
                 * @returns {string} type of the broadcasted message.
                 */
                getType: function () {
                    return type;
                }


            };

            return service;
        }
    ]);