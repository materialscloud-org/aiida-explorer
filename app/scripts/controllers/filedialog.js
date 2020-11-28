"use strict";

angular.module("materialsCloudApp").controller('fileDialogCtrl',
    ["$scope", "$mdDialog",
        function ($scope, $mdDialog) {
            $scope.closeDialog = function() {
                // Easily hides most recent dialog shown...
                // no specific instance reference is needed.
                $mdDialog.hide();
            };
        }
    ]
);