"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.storageService
 * @description
 *
 * This service is used to get/set data in session storage. In session,
 * data is stored in key-value format.
 *
 * #### File location: app/scripts/services/storageservice.js
 *
 * @requires localStorageService :  local storage service object.
 *
 */

angular.module("materialsCloudApp").config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('mcloud')
        .setStorageType('sessionStorage');
});

angular.module("materialsCloudApp").factory("storageService", ["localStorageService", function (localStorageService) {
    var myService = {

        /**
         * @ngdoc
         * @name materialsCloudApp.storageService#getStorageType
         * @methodOf materialsCloudApp.storageService
         *
         * @description
         *  to get type of the storage.
         *
         * @returns {string} storage type.
         */
        getStorageType: function() {
            return localStorageService.getStorageType();
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.storageService#getKeys
         * @methodOf materialsCloudApp.storageService
         *
         * @description
         *  to get all keys of the data stored in session.
         *
         * @returns {string} session keys.
         */
        getKeys: function(){
            return localStorageService.keys();
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.storageService#addItem
         * @methodOf materialsCloudApp.storageService
         *
         * @description
         *  to add/store data in session in key-value format.
         *
         * @param {string} key key to access data from the session storage.
         * @param {object} value data that will be stored in session.
         *
         * @returns {undefined} It doesn't return.
         */
        addItem: function(key, value){
            return localStorageService.set(key, value);
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.storageService#getItem
         * @methodOf materialsCloudApp.storageService
         *
         * @description
         *  to get data stored in session using given key.
         *
         * @param {string} key key to access data from the session storage.
         *
         * @returns {object} data from session storage stored using given key.
         */
        getItem: function(key){
            return localStorageService.get(key);
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.storageService#removeItem
         * @methodOf materialsCloudApp.storageService
         *
         * @description
         *  to remove data stored in session using given key.
         *
         * @param {string} key key to remove data from the session storage.
         *
         * @returns {object} status of the removal.
         * (TODO: check again).
         */
        removeItem: function(key){
            return localStorageService.remove(key);
        }

    };
    return myService;
}
]);
