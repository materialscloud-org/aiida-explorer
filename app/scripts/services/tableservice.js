"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.tableService
 * @description
 *
 * This service is used to display data in table format.
 *
 * #### File location: app/scripts/services/tableservice.js
 *
 * @requires nodeService : to get node data from the server.
 * @requires utils : to get REST server end point.
 * @requires messageService : to broadcast status/update messages.
 * @requires CONFIG : materials cloud configuration file.
 * @requires NgTableParams : external JS library to display table.
 *
 */

angular.module("materialsCloudApp").factory("tableService", ["nodeService", "utils", "messageService", "CONFIG", "NgTableParams",
    function (nodeService, utils, messageService, CONFIG, NgTableParams) {


        var myServices = {

            /**
             * @ngdoc
             * @name materialsCloudApp.tableService#getNgTableColumns
             * @methodOf materialsCloudApp.tableService
             *
             * @description
             *  It processes the node schema and creates list of columns
             *  required to display data in table format.
             *
             * @param {object} schema node schema received from the server.
             * @param {boolean} addActionColumn it is a boolean to decide to add action buttons in the last column.
             *
             * @returns {object} columns list
             */
            getNgTableColumns: function(schema, addActionColumn){
                var columnOrder = schema.data.data.ordering;
                var schemaFields = schema.data.data.fields;

                var ngTableColumns = [];
                var columnInfo, row;
                $.each(columnOrder, function(index, columnName){
                    columnInfo = schemaFields[columnName];
                    row = {};
                    row.field = columnName;
                    if(columnName!=='attributes.state' && columnName!=='creator' && columnName!=='attributes.process_label' && columnName!=='attributes.process_state'){
                        row.sortable = columnName;
                    }
                    row.title = columnInfo.display_name;

                    if(columnInfo.is_display){
                        row.show = true;
                    }
                    else {
                        row.show = false;
                    }
                    ngTableColumns.push(row);
                });
                if(addActionColumn){
                    ngTableColumns.push({
                        field: "action",
                        title: "",
                        dataType: "command"
                    });
                }
                return ngTableColumns;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.tableService#processGridCellValue
             * @methodOf materialsCloudApp.tableService
             *
             * @description
             *  It processes the grid/table cell value before displaying it in table.
             *
             * @param {string} name name of the grid/table cell.
             * @param {string} value value of the grid/table cell received from the server.
             * @param {object} valDict table data.
             *
             * @returns {object} processed value to display in grid/table cell and a boolean
             * to tell if it is a state column. If it is a state column, specific style will
             * be applied to it.
             */
            processGridCellValue: function (name, value, valDict) {
                var returnValue = value;
                var isStateColumn = "";

                if (name === "dbcomputer" && valDict.length > 0) {
                    returnValue = valDict[value].hostname;
                }
                else if (name === "node_type" || name === "type") {
                    returnValue = utils.getDisplayName(value);
                }
                else if (name === "creator") {
                    returnValue = valDict[value].name;
                }
                else if (name === "mtime" || name === "ctime") {
                    var receivedDate = new Date(value);
                    var today = new Date();
                    var compareDate = new Date(today.getFullYear()-1,
                        today.getMonth(), today.getDate());
                    if (receivedDate < compareDate) {

                        // prepend "0" to day if day is less than 10
                        var day = receivedDate.getDate();
                        var dayStr;
                        if (day < 10){
                            dayStr = "0" + day.toString();
                        }
                        else {
                            dayStr = day.toString();
                        }

                        // prepend "0" to month if month is less than 10
                        var month = receivedDate.getMonth() + 1;
                        var monthStr;
                        if (month < 10){
                            monthStr = "0" + month.toString();
                        }
                        else {
                            monthStr = month.toString();
                        }

                        returnValue = dayStr +
                            "-" + monthStr + "-" +
                            receivedDate.getFullYear().toString();
                    }
                    else {
                        returnValue = jQuery.timeago(receivedDate);
                    }
                }

                if (name === "attributes.state") {
                    isStateColumn = myServices.cssForStateCol(value);
                } else if (name === "attributes.process_state"){
                    if (valDict["process_state"] !== null) {
                        returnValue = valDict["process_state"].toUpperCase();
                        if (valDict.exit_status !== null){
                            returnValue = returnValue + " [" + valDict.exit_status + "]";
                        }
                        isStateColumn = myServices.cssForStateCol(returnValue);
                    } else {
                        returnValue = "-";
                    }
                }

                if (name === "attributes.process_label"){
                    if (valDict["process_label"] !== null)
                        returnValue = valDict["process_label"];
                    else
                        returnValue = "-";
                }

                return {value: returnValue, isStateColumn: isStateColumn};
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.tableService#processCellValue
             * @methodOf materialsCloudApp.tableService
             *
             * @description
             *  It calls processGridCellValue function to process
             *  grid/table cell value before displaying it in the table.
             *
             * @param {string} name name of the grid/table cell.
             * @param {string} value value of the grid/table cell received from the server.
             * @param {object} computers list of computers.
             * @param {object} users list of users.
             * @param {object} attributes list of attributes.
             *
             * @returns {object} processed value to display in grid/table cell and a boolean
             * to tell if it is a state column. If it is a state column, specific style will
             * be applied to it.
             */
            processCellValue: function(name, value, attributes, users, computers){
                var columnInfo;
                if (name === "dbcomputer"){
                    columnInfo = myServices.processGridCellValue(name, value, computers);
                }
                else if (name === "creator") {
                    columnInfo = myServices.processGridCellValue(name, value, users);
                } else {
                    columnInfo = myServices.processGridCellValue(name, value, attributes);
                }
                return columnInfo;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.tableService#setPagerStyle
             * @methodOf materialsCloudApp.tableService
             *
             * @description
             *  This is a helper function of the table. It updates the style of the table
             * pagination depending on the total no of records available in the table.
             *
             * @param {int} total total no of records
             * @param {int} count count of the records on current page
             *
             * @returns {undefined} It doesn't return.
             */
            setPagerStyle: function (total, count) {
                if(total < 10 || count === "All"){
                    $(".ng-table-pager").css("padding", "0");
                }
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.tableService#getCountOptions
             * @methodOf materialsCloudApp.tableService
             *
             * @description
             *  This is a helper function of the table. It returns the list of
             * possible count options (no of records displayed on 1 page) depending on
             * the total no of records available in the table.
             *
             * @param {int} total total no of records
             * @param {int} count count of the records on current page
             *
             * @returns {object} list of possible count (no of records displayed on 1 page) options.
             */
            getCountOptions: function (total, count) {
                var countOptions = [];
                if(count !== "All"){
                    if(total > 100){
                        countOptions = [10, 25, 50, 100, "All"];
                    }
                    else if(total>50 && total<100){
                        countOptions = [10, 25, 50, "All"];
                    }
                    else if(total>25 && total<50){
                        countOptions = [10, 25, "All"];
                    }
                    else if(total>10 && total<25){
                        countOptions = [10, "All"];
                    }
                }
                return countOptions;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.tableService#gridNgTable
             * @methodOf materialsCloudApp.tableService
             *
             * @description
             *  This function creates and updates the table for node data.
             *
             * @param {string} nodeType type of the node.
             * @param {string} dataPath data path in node response received from the server.
             * @param {object} extraParams table filters
             *
             * @returns {object} newly generated table object.
             */
            gridNgTable: function (nodeType, dataPath, extraParams, profileRestEndPoint, restAPIVersion, typeColumnName){

                // return url parameters
                function getUrlParameters(nodeType, extraParams, count, pageNo, sorting, filters, restAPIVersion, typeColumnName) {

                    var subUrl;
                    var urlParameters = {};
                    if (count === "All"){
                        subUrl = "";

                    }else{
                        subUrl = "/page/" + pageNo.toString() + "?perpage=" + count.toString();
                    }

                    if (nodeType === "CALCULATION" && restAPIVersion === "v4") {
                        if (subUrl === "") {
                            subUrl = "?attributes=true&attributes_filter=process_label,process_state,exit_status,exit_message,process_status,exception";
                        } else
                        subUrl = subUrl + "&attributes=true&attributes_filter=process_label,process_state,exit_status,exit_message,process_status,exception";
                    }

                    // add extra parameters
                    if(extraParams !== undefined){
                        if(Object.keys(extraParams).length > 0) {
                            $.each(extraParams, function(key, value) {
                                if (key === "custom"){
                                    subUrl = getProcessedFilters(subUrl, {"custom": value}, restAPIVersion, typeColumnName);
                                }
                                else {
                                    urlParameters[key] = value;
                                }
                            });
                        }
                    }

                    var processedOrder = getProcessedSort(nodeType, sorting);
                    $.extend( urlParameters, processedOrder );

                    if (Object.keys(filters).length > 0 && extraParams.custom !== filters.custom) {
                        subUrl = getProcessedFilters(subUrl, filters, restAPIVersion, typeColumnName);
                    }
                    return {urlParameters: urlParameters, subUrl: subUrl};
                }

                // internal helper function to process order clause
                // as per server requirements
                function getProcessedSort (nodeType, selectedOrder){
                    var processedOrder = [];
                    // check if there are any orders selected
                    if(selectedOrder !== undefined){
                        if(Object.keys(selectedOrder).length > 0) {
                            $.each(selectedOrder, function(columnName, orderType) {
                                if (orderType === "asc") {
                                    processedOrder.push(columnName);
                                }
                                else {
                                    processedOrder.push("-" + columnName);
                                }
                            });
                        }
                    }
                    var orderDict = {};
                    if (processedOrder.length > 0){
                        orderDict.orderby = processedOrder.join(",");
                    }
                    else if(nodeType in CONFIG.GRID.DEFAULT_ORDER){
                        // if order is not set, use default order if any
                        orderDict.orderby = CONFIG.GRID.DEFAULT_ORDER[nodeType];
                    }
                    return orderDict;
                }

                // internal helper function to process filter clauses
                // as per server requirements
                function getProcessedFilters(subUrl, selectedFilters, restAPIVersion, typeColumnName){

                    var filterList = [];
                    var filterInfo;

                    // check if there are any filters selected
                    if(selectedFilters !== undefined){
                        if(Object.keys(selectedFilters).length > 0) {

                            $.each(selectedFilters, function(columnName, filterDict) {
                                if(columnName === "custom"){
                                    filterList.push(utils.getCustomFilterDict(filterDict, restAPIVersion, typeColumnName));
                                }
                                else{
                                    //TODO: update this code after implementing external filters functionality
                                    filterList.push(filterDict);
                                }
                            });
                            filterList = utils.processGridFilters(filterList);
                        }
                    }

                    var filterUrl = "";
                    if (filterList.length > 0){
                        filterUrl = filterList.join("&");
                    }
                    subUrl += "&" + filterUrl;

                    return encodeURI(subUrl);
                }

                return new NgTableParams({
                    page: 1,     // show first page
                    count: 10,   // count per page
                    filter: {},
                    sorting: {}
                }, {
                    total: 0, // length of data,
                    getData: function (params) {

                        var urlParameterDict = getUrlParameters(nodeType, extraParams, params.count(),
                            params.page(), params.sorting(), params.filter(), restAPIVersion, typeColumnName);
                        extraParams = {};

                        return nodeService.getNodes(nodeType, urlParameterDict.subUrl, profileRestEndPoint,
                            urlParameterDict.urlParameters).then(
                            // handle success
                            function (response) {
                                params.total(response.headers("X-Total-Count"));

                                // Pagination settings
                                // TODO: need to improve

                                params.settings({
                                    counts: myServices.getCountOptions(params.total(), params.count())
                                });
                                myServices.setPagerStyle(params.total(), params.count());

                                return response.data.data[dataPath];

                            },
                            // handle error
                            function (response) {
                                messageService.updateMessage("Error while connecting to server!",
                                    CONFIG.MESSAGE_TYPE.ERROR, response);
                                params.total(0);
                                params.settings({
                                    counts: []
                                });
                                myServices.setPagerStyle(params.total(), params.count());
                                return [];
                            }
                        );

                    }
                });

            },

            /**
             * @ngdoc
             * @name materialsCloudApp.tableService#cssForStateCol
             * @methodOf materialsCloudApp.tableService
             *
             * @description
             *  It returns the style for state column in table. Different styles (colors)
             *  are used to show different states.
             *
             * @param {string} value state name (E.g. FINISHED, FAILED, etc.).
             *
             * @returns {object} style/color for given state.
             */
            cssForStateCol: function(value){
                //var statusColumnClass = "label label-info";
                var statusColumnClass = "";
                if(value === "FAILED"){
                    statusColumnClass = "label label-danger";
                }
                else if(value === "FINISHED"){
                    statusColumnClass = "label label-success";
                }
                else if(value === "FINISHED [0]"){
                    statusColumnClass = "label label-success";
                }
                else if(value === "CREATED"){
                    statusColumnClass = "label label-success";
                }
                else if(value === "RUNNING"){
                    statusColumnClass = "label label-success";
                }
                else if(value === "WAITING"){
                    statusColumnClass = "label label-success";
                }
                else if(value.startsWith("FINISHED")){
                    statusColumnClass = "label label-warning";
                }
                else if(value === "ERROR"){
                    statusColumnClass = "label label-warning";
                }
                else if(value === "EXCEPTED"){
                    statusColumnClass = "label label-warning";
                }
                else if(value === "KILLED"){
                    statusColumnClass = "label label-warning";
                }
                return statusColumnClass;
            }
        };

        return myServices;
    }
]);
