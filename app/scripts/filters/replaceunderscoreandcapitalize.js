'use strict';

/**
 * @ngdoc filter
 * @name materialsCloudApp.filter:replaceUnderscoreAndCapitalize
 * @function
 * @description
 * # replaceUnderscoreAndCapitalize
 * Filter in the materialsCloudApp.
 */
angular.module('materialsCloudApp')
  .filter('replaceUnderscoreAndCapitalize', function () {
    return function (input) {
      if (typeof input === 'string') {
          return input.replace(/\w\S*/g, function (txt) {
              /*
              if(txt !== "GMT")
                  return txt.replace(/_/g, ' ').charAt(0).toUpperCase() + txt.substr(1).replace(/_/g, ' ').toLowerCase();
              else
                  return txt;
              */
              return txt;
          });
      } else {
          return input;
      }
    };
  });
