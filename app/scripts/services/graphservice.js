"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.graphService
 * @description
 *
 * It provides the functionality to show graphs, plots using
 * different JavaScript libraries.
 *
 * #### File location: app/scripts/services/graphservice.js
 *
 * @requires utils : for util functionality
 * @requires $window : to use window resize event
 * @requires $state : to change state url
 *
 */


angular.module("materialsCloudApp").service("graphService",["utils", "$window", "$state", "CONFIG",
    function (utils, $window, $state, CONFIG) {

        var myService = {

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highchartTheme
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method decides the theme for all plots displayed
             *  using Highchart JavaScript library.
             *
             * @returns {undefined} It doesn't return.
             */
            highchartTheme: function () {
                Highcharts.theme = {
                    colors: ["#4286f4", "#ef7151", "#ef9651", "#efd251", "#bdef51",
                        "#58d345", "#45d38a", "#45d3bc", "#3bcced", "#2aa6f9", "#3043f2",
                        "#8029f2", "#b229f2", "#ea46ea", "#ef67ad", "#ef6786"],
                    chart: {
                        backgroundColor: {
                            linearGradient: [0, 0, 500, 500],
                            stops: [
                                [0, 'rgb(255, 255, 255)'],
                                [1, 'rgb(255, 255, 255)']
                            ]
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        style: {
                            color: '#000',
                            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    subtitle: {
                        style: {
                            color: '#666666',
                            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },

                    legend: {
                        itemStyle: {
                            font: '9pt Trebuchet MS, Verdana, sans-serif',
                            color: 'black'
                        },
                        itemHoverStyle:{
                            color: 'gray'
                        },
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    xAxis: {
                        minorTickInterval: 'auto',
                        gridLineWidth: 1,
                        lineColor: '#6E6E6E',
                        tickColor: '#000',
                        minorGridLineColor: '#F2F2F2',
                        labels: {
                            style: {
                                color: '#0B3861',
                                font: '12px Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        title: {
                            style: {
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        minorTickInterval: 'auto',
                        lineColor: '#6E6E6E',
                        lineWidth: 1,
                        tickWidth: 1,
                        tickColor: '#000',
                        minorGridLineColor: '#F2F2F2',
                        labels: {
                            style: {
                                color: '#0B3861',
                                font: '12px Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        title: {
                            style: {
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 0
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    }
                };
                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highchartPie
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays piechart using Highchart JS library.
             *
             * @param {string} renderDiv html element id where piechart will be displayed.
             * @param {string} title of the chart.
             * @param {object} data data that will be displayed in piechart.
             * @param {int} total total count to calculate percentage.
             *
             * @returns {object} piechart object
             */
            highchartPie: function (renderDiv, title, data, total) {
                myService.highchartTheme();

                function processStatistics(dataInfo, total){
                    // calculate percentage
                    var pieData = [];
                    if(Object.keys(dataInfo).length > 0) {
                        $.each(dataInfo, function (dataType, count) {
                            var tmp = {};
                            tmp.name = dataType;
                            tmp.y = count;
                            tmp.percentage = ((100 * count) / total).toFixed(2);
                            pieData.push(tmp);
                        });
                    }
                    return pieData;
                }

                return new Highcharts.Chart({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie',
                        renderTo: renderDiv
                    },
                    title: {
                        text: title
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b> <br> {point.percentage:.2f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'count',
                        colorByPoint: true,
                        data: processStatistics(data, total)
                    }]
                });
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#highstockTimeline
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays timeline using Highstock JS library.
             *
             * @param {string} renderDiv html element id where timeline will be displayed.
             * @param {object} dataSeries data series displayed in time line.
             * @param {string} title title of the timeline.
             * @param {string} yaxisLegend Y axis legend.
             *
             * @returns {object} timeline object
             */
            highstockTimeline: function(renderDiv, dataSeries, title, yaxisLegend){

                myService.highchartTheme();

                return Highcharts.StockChart({
                    chart: {
                        renderTo: renderDiv,
                        alignTicks: false
                    },
                    title: {
                        text: title
                    },
                    rangeSelector: {
                        selected: 1
                    },
                    //subtitle: {
                    //    text: document.ontouchstart === undefined ?
                    //        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                    //},
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y-%m-%d<br/>%H:%M:%S',
                            minute: '%Y-%m-%d<br/>%H:%M',
                            hour: '%Y-%m-%d<br/>%H:%M',
                            day: '%Y-%m-%d',
                            week: '%Y-%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    yAxis: {
                        min: 0
                    },
                    legend: {
                        enabled: false
                    },
                    series: [
                        {
                            type: 'column',
                            name: 'count',
                            data: processData(dataSeries),
                            groupPadding: 0,
                            pointPadding: 0,
                            states: {
                                hover: {
                                    marker: {enabled: true}
                                }
                            },
                            dataGrouping: {
                                groupPixelWidth: 40,
                                units: [['day', [1]],
                                    [
                                        'week', // unit name
                                        [1] // allowed multiples
                                    ], [
                                        'month',
                                        [1, 4]
                                    ], ['year', [1]]]
                            }
                        }
                    ]
                });

                function processData(unprocessedData){
                    var processedData = [];
                    if(Object.keys(unprocessedData).length > 0) {
                        $.each(unprocessedData, function (dateStr, count) {
                            var dateObj = new Date(dateStr);
                            processedData.push([dateObj.getTime(), count]);
                        });
                    }
                    return processedData;
                }
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#displayExploreStatistics
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays the statistics for explore section using
             *  Highchart/Highstock JS library.
             *  for example,
             *      - total no. of calculations created per month.
             *      - no. of calculations created by logged in user per month.
             *      - no. of calculations per type are stored in database.
             *      - etc.
             *
             * @param {string} nodeType type of the node whose statistics are displayed (e.g. calculation, data).
             * @param {object} response statistics data.
             *
             * @returns {object} chart objects.
             */
            displayExploreStatistics: function(nodeType, response, selectedUser){

                nodeType = nodeType.toLowerCase();
                var charts = {};
                var dataTypes = {};

                $.each(response.data.data.types, function (dataType, count) {
                    var displayDataType = utils.getDisplayName(dataType);
                    dataTypes[displayDataType] = count;
                });

                var pieChartTitle = "", linePlotTitle = "";
                if (selectedUser !== "") {
                    pieChartTitle = "Number of nodes per type created by " + selectedUser;
                    linePlotTitle = "Number of nodes created per time period by " + selectedUser;
                }
                else {
                    pieChartTitle = "Number of nodes created per type";
                    linePlotTitle = "Number of nodes created per time period";
                }
                // pie chart: database statistics
                charts.db_node_piechart = myService.highchartPie("db_node_piechart", pieChartTitle, dataTypes,
                    response.data.data.total);
                // time line: database statistics
                charts.db_node_ctime_timeline = myService.highstockTimeline("db_node_timeline",
                    response.data.data.ctime_by_day, linePlotTitle, "#"+nodeType);

                return charts;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#displayTimelineStatistics
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays the statistics for explore section using
             *  Highchart/Highstock JS library.
             *  for example,
             *      - total no. of calculations created per month.
             *      - no. of calculations created by logged in user per month.
             *      - no. of calculations per type are stored in database.
             *      - etc.
             *
             * @param {string} nodeType type of the node whose statistics are displayed (e.g. calculation, data).
             * @param {object} response statistics data.
             *
             * @returns {object} chart objects.
             */
            displayTimelineStatistics: function(nodeType, response, selectedUser){

                nodeType = nodeType.toLowerCase();
                var charts = {};

                var linePlotTitle = "";
                if (selectedUser !== "") {
                    linePlotTitle = "Number of nodes created per time period by " + selectedUser;
                }
                else {
                    linePlotTitle = "Number of nodes created per time period";
                }

                // time line: database statistics
                charts.db_node_ctime_timeline = myService.highstockTimeline("db_node_timeline",
                    response.data.data.ctime_by_day, linePlotTitle, "#"+nodeType);

                return charts;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#displayFullTypeStatistics
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays the statistics for explore section using
             *  Highchart/Highstock JS library.
             *  for example,
             *      - total no. of calculations created per month.
             *      - no. of calculations created by logged in user per month.
             *      - no. of calculations per type are stored in database.
             *      - etc.
             *
             * @param {string} nodeType type of the node whose statistics are displayed (e.g. calculation, data).
             * @param {object} response statistics data.
             *
             * @returns {object} chart objects.
             */
            displayFullTypeStatistics: function(nodeType, fullTypes, total, selectedUser){

                nodeType = nodeType.toLowerCase();
                var charts = {};

                var pieChartTitle = "";
                if (selectedUser !== "") {
                    pieChartTitle = "Number of " + nodeType + " per type created by " + selectedUser;
                }
                else {
                    pieChartTitle = "Number of " + nodeType + " created per type";
                }
                // pie chart: database statistics
                charts.db_node_piechart = myService.highchartPie("db_" + nodeType + "_piechart", pieChartTitle,
                    fullTypes, total);

                return charts;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#reloadStatisticsGraphs
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method reloads the statistics charts again.
             *
             * @param {object} charts statistics charts objects
             *
             * @returns {undefined} It doesn't return.
             */
            reloadStatisticsGraphs: function(charts){
                setTimeout(function () {
                    $.each(charts, function (key, chart) {
                        chart.reflow();
                    });
                }, 0);
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.graphService#visTree
             * @methodOf materialsCloudApp.graphService
             *
             * @description
             *  this method displays node inputs and outputs in tree like structure
             *  using vistree JS library.
             *  On tree node,
             *   - on single click it displays short description of the tree node.
             *   - on double click it goes to the visualization page that tree node.
             *
             * @param {object} treeData node tree data
             * @param {string} container html element id.
             * @param {object} treeDetailFunc function to be called on double click on tree node.
             * @param {object} treeOnClick function to be called on single click on tree node.
             *
             * @returns {object} tree object.
             */
            visTree: function(treeData, container, treeDetailFunc, useTreeLimit, restApiVersion){

                if (restApiVersion == 'v2' || restApiVersion == 'v3') {
                    var nodetype = 'nodetype';
                    var nodeuuid = 'nodeuuid';
                    var nodelabel = 'nodelabel';
                    var linktype = 'linktype';
                    var linklabel = 'linklabel';
                } else {
                    var nodetype = 'node_type';
                    var nodeuuid = 'uuid';
                    var nodelabel = 'node_label';
                    var linktype = 'link_type';
                    var linklabel = 'link_label';
                }

                function getTooltipText(node){

                    var title = "";

                    // Link label
                    if(node[nodelabel] !== undefined && node[nodelabel] !== "")
                        title += "Node Label: " + node[nodelabel] + "<br>";

                    // Node type
                    if (restApiVersion == 'v2' || restApiVersion == 'v3') {
                        title += "Node Type: " + node.displaytype + "<br>";
                    } else {
                        var type = node[nodetype];
                        if(type.indexOf(".") !== -1){
                            type = type.split(".");
                            type = type[type.length-2];
                        }
                        title += "Node Type: " + type + "<br>";
                    }

                    // UUID
                    title += "UUID: " + node[nodeuuid].split("-")[0] + "<br>";

                    // Link type
                    if(node[linktype] !== undefined && node[linktype] !== "")
                        title += "Link Type: " + node[linktype] + "<br>";
                    // Link label
                    if(node[linklabel] !== undefined && node[linklabel] !== "")
                        title += "Link Label: " + node[linklabel] + "<br>";

                    // Description
                    if(node.description !== undefined && node.description !== "" && node.description !== null) {
                        title += "<hr>";
                        title += "" + node.description + "<br>";
                    }

                    return title;
                }

                function processIOData(data){
                    if (restApiVersion == 'v4') {
                        var incomings = data[0]['incoming'];
                        var outgoings = data[0]['outgoing'];
                        //delete data[0]['incoming'];
                        //delete data[0]['outgoing'];
                        data[0]['isMainNode'] = true;
                        data = data.concat(incomings).concat(outgoings);
                        $.each(data, function (index, node) {
                            data[index]["id"] = index;
                        });
                    }
                    if(data.length > 0) {
                        var is_main_node;
                        $.each(data, function (index, node) {
                            data[index]["title"] = getTooltipText(node);
                            data[index]["label"] = utils.getDisplayName(node[nodetype]);
                            is_main_node = false;

                            if(data[index]["group"] == 'main_node' || data[index]["group"] == 'mainNode' || data[index]['isMainNode']) {
                                is_main_node = true;
                            }

                            if(node[nodetype].startsWith('process.workflow')) {
                                data[index]['shape'] = 'diamond';
                                data[index]['size'] = 22;

                                if(node[nodetype] == 'process.workflow.workchain.WorkChainNode.')
                                    data[index]['group'] = 'workchains';
                                else if(node[nodetype] == 'process.workflow.workfunction.WorkFunctionNode.')
                                    data[index]['group'] = 'workfunctions';
                            }
                            else if(node[nodetype].startsWith('process.calculation') || node[nodetype].startsWith('calculation')){
                                data[index]['shape'] = 'square';

                                if(node[nodetype] == 'process.calculation.calcjob.CalcJobNode.' || node[nodetype].startsWith('calculation.job.'))
                                    data[index]['group'] = 'calcjobs';
                                else if(node[nodetype] == 'process.calculation.calcfunction.CalcFunctionNode.' || node[nodetype].startsWith('calculation.inline.'))
                                    data[index]['group'] = 'calcfunctions';
                            }
                            else if(node[nodetype].startsWith('data.')){
                                if(node[nodetype].startsWith('data.code')) {
                                    data[index]['shape'] = 'triangle';
                                    data[index]['group'] = 'codes';
                                }
                                else {
                                    data[index]['shape'] = 'dot';
                                    data[index]['group'] = 'data';
                                }
                            }
                            else if(node[nodetype].startsWith('code.Code.')) {
                                data[index]['shape'] = 'triangle';
                                data[index]['group'] = 'codes';
                            }
                            else{
                                data[index]['shape'] = 'star';
                                data[index]['group'] = 'default';
                            }

                            if (is_main_node){
                                data[index]['color'] = {'border': 'grey'};
                            }

                            /*
                            // code from suggestion 2: inputs green and outputs orange
                            // update shape and group
                            if(node.nodetype.startsWith('process.workflow')){
                                data[index]['shape'] = 'diamond';
                                data[index]['group'] = 'worknodes';
                                data[index]['size'] = 22;
                            }
                            else if(node.nodetype.startsWith('process.calculation') || node.nodetype.startsWith('calculation')){
                                data[index]['shape'] = 'square';
                            }
                            else if(node.nodetype.startsWith('data.')){
                                if(node.nodetype.startsWith('data.code'))
                                    data[index]['shape'] = 'triangle';
                                else
                                    data[index]['shape'] = 'dot';
                            }
                            else if(node.nodetype.startsWith('code.Code.')) {
                                data[index]['shape'] = 'triangle';
                            }
                            else{
                                data[index]['shape'] = 'star';
                            }
                            */

                            if(useTreeLimit) {
                                if (index >= (CONFIG["NODE_LIMIT_PROVENANCE_BROWSER"] * 2))
                                    return false;
                            }
                        });
                    }
                    if (useTreeLimit)
                        data = data.slice(0, (CONFIG["NODE_LIMIT_PROVENANCE_BROWSER"] * 2));

                    return data;
                }

                function processEdges(edges, nodes){
                    if (restApiVersion == 'v2' || restApiVersion == 'v3') {
                        if(edges.length > 0){
                            $.each(edges, function (index, edge) {

                                // ## Suggestion 1
                                // add edge width depending on its type
                                //if (edge["linktype"] == "return" || edge["linktype"] == "call_calc") {
                                    //edges[index]["dashes"] = true;
                                    //edges[index]["width"] = 2;
                                //}

                                /*
                                // ## Suggestion 2
                                if (edge["linktype"] == "return") {
                                    edges[index]['color']['inherit'] = 'from';
                                }
                                if (edge["linktype"] == "call_calc") {
                                    edges[index]['color']['inherit'] = 'from';
                                }
                                */

                                // ## Suggestion 3
                                if (edge["linktype"] == "input_work") {
                                    // dashes array: [dash length, gap length]
                                    edges[index]["dashes"] = [14,8];
                                    edges[index]["width"] = 2;
                                }
                                if (edge["linktype"] == "call_calc") {
                                    edges[index]["dashes"] = [3,6];
                                    edges[index]["width"] = 2;
                                }

                                // update link label
                                var connected_node = null;

                                if (edge["color"]["inherit"] == "from")
                                    connected_node = nodes[edge["from"]];
                                else if (edge["color"]["inherit"] == "to")
                                    connected_node = nodes[edge["to"]];
                                if (connected_node) {
                                    if (connected_node["linklabel"] !== undefined && connected_node["linklabel"] !== "") {
                                        if(connected_node["linklabel"].length > 15)
                                            edges[index]["label"] = connected_node["linklabel"].substr(0, 15) + "...";
                                        else
                                            edges[index]["label"] = connected_node["linklabel"];
                                    }
                                    else
                                        edges[index]["label"] = "";
                                }
                                else
                                    edges[index]["label"] = "";

                                if(edges[index]['color']['inherit'] == 'from') {
                                    edges[index]['color'] = {'color': '#62636a'};
                                }

                                if(edges[index]['color']['inherit'] == 'to') {
                                    edges[index]['color'] = {'color': '#6b78ec'};
                                    edges[index]['font']= {'color': '#6b78ec'};
                                }

                            });
                        }
                    } else {
                        var incomings = nodes[0]['incoming'];
                        var outgoings = nodes[0]['outgoing'];
                        var edges = [];

                        if (incomings.length > 0){
                            for (var i = 0; i < incomings.length; i++) {
                                edges[i] = {"arrows": "to", "from": i + 1, "to": 0};
                            }
                            $.each(incomings, function (index, incomingNode) {
                                if (incomingNode[linktype] == "input_work") {
                                    // dashes array: [dash length, gap length]
                                    edges[index]["dashes"] = [14,8];
                                    edges[index]["width"] = 2;
                                }
                                if (incomingNode[linktype] == "call_calc") {
                                    edges[index]["dashes"] = [3,6];
                                    edges[index]["width"] = 2;
                                }
                                edges[index]['color'] = {'color': '#62636a'};
                                if(incomingNode[linklabel].length > 15)
                                    edges[index]["label"] = incomingNode[linklabel].substr(0, 15) + "...";
                                else
                                    edges[index]["label"] = incomingNode[linklabel];
                            });
                        }

                        if (outgoings.length > 0){
                            for (i = incomings.length; i < incomings.length + outgoings.length; i++) {
                                edges[i] = {"arrows": "to", "from": 0, "to": i + 1};
                            }
                            $.each(outgoings, function (index, outgoingNode) {
                                if (outgoingNode[linktype] == "input_work") {
                                    // dashes array: [dash length, gap length]
                                    edges[index + incomings.length]["dashes"] = [14,8];
                                    edges[index + incomings.length]["width"] = 2;
                                }
                                if (outgoingNode[linktype] == "call_calc") {
                                    edges[index + incomings.length]["dashes"] = [3,6];
                                    edges[index + incomings.length]["width"] = 2;
                                }
                                edges[index + incomings.length]['color'] = {'color': '#6b78ec'};
                                edges[index + incomings.length]['font']= {'color': '#6b78ec'};
                                if(outgoingNode[linklabel].length > 15)
                                    edges[index + incomings.length]["label"] = outgoingNode[linklabel].substr(0, 15) + "...";
                                else
                                    edges[index + incomings.length]["label"] = outgoingNode[linklabel];
                            });
                        }
                    }
                    return edges;
                }

                var nodes = processIOData(treeData.nodes);
                var edges = processEdges(treeData.edges, treeData.nodes);

                var data = {
                    nodes: nodes,
                    edges: edges
                };
                var options = {
                    nodes: {
                        shape: 'dot',
                        size: 18,
                        font: {
                            size: 12,
                            color: 'SlateBlue',
                            face: '"Trebuchet MS", Helvetica, sans-serif'
                        },
                        borderWidth: 4
                    },
                    edges: {
                        arrows: {
                            to: {enabled: true, scaleFactor:0.7, type:'arrow'}
                        },
                        width: 3,
                        dashes: false,
                        length: 120,
                        font: {
                            size: 12,
                            color: 'black',
                            align: 'top',
                            strokeWidth: 1,
                            strokeColor : '#d1d1d1'
                        }
                    },
                    groups: {
                        'mainNode': {
                            color: {background:'darkgrey', border:'grey'}
                        },
                        'main_node': {
                            color: {background:'darkgrey', border:'grey'}
                        },
                        'inputs': {
                            color: {background:'#1b9e77', border:'#1b9e77'}
                        },
                        'outputs': {
                            color: {background:'#d95f02', border:'#d95f02'}
                        },
                        'worknodes': {
                            color: {background:'#6776f9', border:'#6776f9'}
                        },
                        'workchains': {
                            color: {background:'#e38851ff', border:'#e38851ff'} //orange
                        },
                        'workfunctions': {
                            color: {background:'#e38851ff', border:'#e38851ff'} //orange
                        },
                        'calcjobs': {
                            color: {background:'#de707fff', border:'#de707fff'} //red
                        },
                        'calcfunctions': {
                            color: {background:'#de707f', border:'#de707f'} //red
                        },
                        'codes': {
                            color: {background:'#4ca4b9', border:'#4ca4b9'} // blue
                        },
                        'data': {
                            color: {background:'#8cd499ff', border:'#8cd499ff'} // green
                        },
                        'default': {
                            color: {background:'grey', border:'grey'}
                        }
                    },
                    autoResize: true,
                    interaction: {
                        hover:true,
                        zoomView: false,
                        dragNodes: true,
                        dragView: false,
                        selectable: true
                    },
                    layout: {
                        randomSeed: undefined,
                        improvedLayout:true,
                        hierarchical: {
                            enabled:false,
                            levelSeparation: 150,
                            nodeSpacing: 100,
                            treeSpacing: 200,
                            blockShifting: true,
                            edgeMinimization: true,
                            parentCentralization: true,
                            direction: 'LR',        // UD, DU, LR, RL
                            sortMethod: 'directed'   // hubsize, directed
                        }
                    }
                };

                $.each(options.groups, function (name, values) {
                    options['groups'][name]['color']['hover'] = {background:values['color']['background'], border:'grey'};
                    options['groups'][name]['color']['highlight'] = {background:values['color']['background'], border:'grey'};
                });

                var network = new vis.Network(container, data, options);
                //var previousSelection = null;

                network.on("click", function (params) {
                    // disable to reload the same (main) node again
                    if(nodes[params.nodes] != undefined && nodes[params.nodes].group != "mainNode" && nodes[params.nodes].color == undefined) {
                        treeDetailFunc(nodes[params.nodes], true);
                    }
                });

                // change cursor type to pointer on node hover and
                // back to default if in other canvas area
                network.on("hoverNode", function (params) {
                    // Do not change the corsor type if it a main/center node
                    if(nodes[params.node] != undefined && nodes[params.node].group != "mainNode") {
                        network.canvas.body.container.style.cursor = 'pointer';
                    }
                });
                network.on("blurNode", function (params) {
                    network.canvas.body.container.style.cursor = 'default';
                });

                return network;
            }
        };
        return myService;
    }]);
