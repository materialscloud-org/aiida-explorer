"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.utils
 * @description
 *
 * This service provides util functions.
 *
 * #### File location: app/scripts/services/utils.js
 *
 * @requires CONFIG : materials cloud configuration file.
 * @requires storageService : to get/set data in session storage.
 * @requires ENV : get access ENV variable.
 */

app.service("utils", ["CONFIG", "storageService", "messageService", "ENV", "PROFILES",
    function (CONFIG, storageService, messageService, ENV, PROFILES) {

    var helpers = {

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#getDisplayName
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It returns the display name for the node.
         *
         * @param {object} nodeDict node information.
         *
         * @returns {string} node display name.
         */
        getDisplayName: function(nodeDict){
            // if only type is passed as a nodeDict then
            // convert it into dictionary
            if (jQuery.type(nodeDict) === "string"){
                nodeDict = {type: nodeDict, label: ""};
            }

            var namelist = nodeDict.type.split(".");
            if (namelist[0] === "codes"){
                if(nodeDict.label !== ""){
                    return nodeDict.label;
                }
                else{
                    return "code";
                }
            }
            else{
                return namelist[namelist.length-2];
            }

        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#createKWindow
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It creates the window using Kendo JS library.
         *
         * @param {string} renderDiv html element id where window will be rendered.
         * @param {string} appendToDiv parent html element id.
         * @param {string} windowTitle window title.
         * @param {object} winActions actions list added into window (e.g. close, minimise, etc.)
         * @param {boolean} autoFocus boolean to decide to focus on window after creating it.
         *
         * @returns {object} window object.
         */
        createKWindow: function (renderDiv, appendToDiv, windowTitle, winActions, autoFocus) {


            var winObj = $(renderDiv).kendoWindow({
                width: "100%",
                title: windowTitle,
                visible: true,
                draggable: false,
                resizable: false,
                model: false,
                autoFocus: autoFocus,
                actions: winActions,
                open: function (e) {
                    this.wrapper.css({top: 0, left: 0});
                },
                appendTo: appendToDiv
            }).data("kendoWindow");

            winObj.center().open();

            // onclick event on titlebar to open/close window
            winObj.wrapper.find(".k-window-titlebar").click(function (e) {

                var minimized = winObj.isMinimized();
                if(minimized) {
                    winObj.restore();
                }
                else {
                    winObj.minimize();
                }
            });

            return winObj;
        },


        createPrimaryPanel: function (renderDiv, appendToDiv, windowTitle) {

            var appendTo = angular.element(appendToDiv);
            appendTo.addClass("panel panel-primary sssp-panel");
            appendTo.append(angular.element("<div class='panel-heading sssp-panel-heading'>" + windowTitle + "</div>"));
            var winObj = angular.element(renderDiv);
            winObj.addClass("panel-body");
            appendTo.append(winObj);
            return winObj;
        },


        /*        createPlotPanel: function (renderDiv, appendToDiv, windowTitle, description) {

         var appendTo = angular.element(appendToDiv);
         appendTo.addClass("panel panel-primary sssp-panel");
         appendTo.append(angular.element("<div class='panel-heading sssp-panel-heading'>" + windowTitle + "</div>"));
         var winObj = angular.element(renderDiv);
         winObj.addClass("panel-body");
         appendTo.append(winObj);
         winObj.prepend(angular.element("<div align='center'>" + description +"</div>"));
         return winObj;
         },*/


        /**
         * @ngdoc
         * @name materialsCloudApp.utils#processGridFilters
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It processes the grid/table filters from Explore section.
         *
         * @param {object} selectedFilters list of selected filters.
         *
         * @returns {object} processed grid/table filters.
         */
        processGridFilters: function(selectedFilters) {

            function processOperator(mapper, value){
                var updatedValue = value;
                if (mapper.indexOf("VALUE") >= 0){
                    updatedValue = mapper.replace("VALUE", value);
                }
                else{
                    updatedValue = mapper + processValue(value);
                }
                return updatedValue;

            }

            function processValue(value){
                if($.type(value) === "string") {
                    return '"' + value + '"';
                }
                else {
                    return value;
                }
            }

            var filters = [];
            var filter, opValue;
            if (Object.keys(selectedFilters).length > 0) {
                $.each(selectedFilters, function (index, filterInfo) {
                    // filterInfo is a dict contains:
                    // 1. field, 2. fieldType 3.operator, 4.value
                    opValue = processOperator(CONFIG.GRID.FILTER_OPERATOR_MAPPER[filterInfo.fieldType][filterInfo.operator].mapper, filterInfo.value);
                    filter = filterInfo.field + opValue;

                    filters.push(filter);
                });
            }
            return filters;

        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#getCustomFilterDict
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It returns the custom filters stored in materials cloud config file.
         *
         * @param {string} filterName name of the filter.
         *
         * @returns {object} custom filters.
         */
        getCustomFilterDict: function (filterName, restAPIVersion, typeColumnName) {
            var info =  CONFIG.GRID["FILTERS_" + restAPIVersion.toUpperCase()][filterName];
            var typeOperator = CONFIG.GRID["FILTERS_" + restAPIVersion.toUpperCase()]["TYPE_OPERATOR"];
            if (info == undefined)
                info = {field:typeColumnName, fieldType:"STRING", operator:typeOperator, value:filterName};
            return info;
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#getRestServerEndpoint
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It checks if new REST server end point added using server connect feature
         *  is stored in session storage.
         *  If yes, returns it else return the default one.
         *
         * @returns {string} REST server end point.
         */
        getRestServerEndpoint: function() {

            var server = storageService.getItem(CONFIG.CONSTANT.AUTH.REST_SERVER_KEY);

            if(server != null) {
                return server;
            } else {
                return ENV.serverEndPoint;
            }
        },

        getExploreProfileInfo: function(profileName) {

            var endPointInfo = PROFILES[profileName];

            if(endPointInfo !== undefined) {
                endPointInfo.RESTENDPOINT = ENV.hostAiidaBackend + endPointInfo.REST_URL;
                if (endPointInfo.DISCOVER_URL != null) {
                    endPointInfo.DISCOVER_URL_FULL = ENV.hostBackend + endPointInfo.DISCOVER_URL;
                }
                return endPointInfo;
            }
            else
                return "Error";
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#setRestServerEndpoint
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It is used in server connect feature. It stores the entered new REST
         *  server end point in session storage.
         *
         * @returns {undefined} It doesn't return.
         */
        setRestServerEndpoint: function(server) {
            storageService.addItem(CONFIG.CONSTANT.AUTH.REST_SERVER_KEY, server);
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#setUserServerEndpoint
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It is used in server connect feature. It stores the entered new REST
         *  server end point in session storage.
         *
         * @returns {undefined} It doesn't return.
         */
        setUserServerEndpoint: function(server) {
            storageService.addItem(CONFIG.CONSTANT.AUTH.REST_SERVER_KEY, server);
        },

        isUrlValid: function(url) {
            return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#getUserServerEndpoint
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It checks if new REST server end point added using server connect feature
         *  is stored in session storage.
         *  If yes, returns it else return the default one.
         *
         * @returns {string} REST server end point.
         */
        getUserServerEndpoint: function() {

            var server = storageService.getItem(CONFIG.CONSTANT.AUTH.REST_SERVER_KEY);

            if(server != null) {
                return server;
            } else {
                return "";
            }
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#resetRestServerEndpoint
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It is used in server connect feature. It removes the REST
         *  server end point stored in session storage.
         *
         * @returns {undefined} It doesn't return.
         */
        resetRestServerEndpoint: function() {
            storageService.removeItem(CONFIG.CONSTANT.AUTH.REST_SERVER_KEY);
        },

        /**
         * @ngdoc
         * @name materialsCloudApp.utils#getUniqueArray
         * @methodOf materialsCloudApp.utils
         *
         * @description
         *  It removes the duplicate entries from list and returns unique array.
         *
         * @returns {undefined} unique array.
         */
        getUniqueArray: function unique(array){
            return array.filter(function(el, index, arr) {
                return index === arr.indexOf(el);
            });

        },

        getCompoundNamesWithSubscripts: function(compound) {

            function is_numeric(str){
                return /^\d+$/.test(str);
            }

            var chars = compound.split('');
            var result = "";

            $.each(chars, function(id, char) {
                if(is_numeric(char)) {
                    result = result + "<sub>" + char + "</sub>";
                } else {
                    result = result + char;
                }
            });

            return result;
        },

        processDateFormat: function(datestr){
            var formattedDate;
            var receivedDate = new Date(datestr);

            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var day = receivedDate.getDate();
            var monthIndex = receivedDate.getMonth();
            var year = receivedDate.getFullYear();

            var today = new Date();
            var compareDate = new Date(today.getFullYear()-1,
                today.getMonth(), today.getDate());

            var istimeago;

            if (receivedDate < compareDate) {
                formattedDate = day + ' ' + monthNames[monthIndex] + ' ' + year;
                istimeago = false;
            }
            else {
                formattedDate = jQuery.timeago(receivedDate);
                istimeago = true;
            }

            return {
                "istimeago": istimeago,
                "formattedDate": formattedDate
            };

        },

        nicerNotation: function (num, noOfDigits) {
            if (noOfDigits === undefined)
                noOfDigits = 3;
            try{
                var sOut = num.toExponential(noOfDigits).toString();
                if (sOut.indexOf("e") > 0){
                    sOut = sOut.replace("e","&middot;10<sup>")+"</sup>";
                }
                return sOut;

            }
            catch (e) {
                return num;
            }
        },

        makeTestAjaxCall: function(url, callback) {
            $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    callback(data);
                },
                error:function(data){
                    callback(data);
                }
            });
        }

    };
    return helpers;
}
]);

