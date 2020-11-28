/*
 Band structure

 Author: Giovanni Pizzi (2018)

 Lincense: The MIT License (MIT)

 Copyright (c), 2018, ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE
 (Theory and Simulation of Materials (THEOS) and National Centre for
 Computational Design and Discovery of Novel Materials (NCCR MARVEL)),
 Switzerland.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

*/

// Utility 'zip' function analogous to python's, from
// https://stackoverflow.com/questions/4856717
var zip = function () {
    var args = [].slice.call(arguments);
    var shortest = args.length==0 ? [] : args.reduce(function(a,b){
        return a.length<b.length ? a : b
    });

    return shortest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
}

// Utility function to convert a string in a array describing a path
function getPathStringFromPathArray (path) {
    var string = [];
    var lastPoint = "";
    path.forEach(function(thisPath) {
        if (string.length == 0) {
            string += thisPath[0];
            string += "-"
            string += thisPath[1];
        }
        else {
            if (lastPoint != thisPath[0]) {
                string += "|" + thisPath[0];
            }
            string += "-";
            string += thisPath[1];
        }
        lastPoint = thisPath[1];
    });

    return string;
}

// Utility function to convert an array describing a path in a short string
function getPathArrayFromPathString (pathString) {
    var finalPath = [];
    // Each path separated by | can be treated independently and appended
    var independentPieces = pathString.split("|");
    independentPieces.forEach(function(stringPiece) {
        // Split by dash
        pointsStrings = stringPiece.split('-');
        // remove unneeded spaces, remove empty items (so e.g. X--Y still works as X-Y)
        pointsTrimmedStrings = pointsStrings.map(function(pointName) { return pointName.trim()});
        points = pointsTrimmedStrings.filter(function(pointName) { return pointName != ""});

        zip(points.slice(0,points.length-1), points.slice(1)).forEach(function(pair) {
            finalPath.push([pair[0], pair[1]]);
        })
    })
    return finalPath;
}

// Utility function to get all point labels existing in the data
function getValidPointNames(data) {
    var validNames = [];
    data.paths.forEach(function(segment) {
        validNames.push(segment.from);
        validNames.push(segment.to);
    })
    var uniqueNames = Array.from(new Set(validNames));
    uniqueNames.sort(); // in place
    return uniqueNames;
}


/////////////// MAIN CLASS DEFINITION /////////////////
function BandPlot(divID) {
    this.divID = divID;
    this.data = {};
    // Keep track of the current path to avoid too many refreshes
    this.currentPath = [];
}
BandPlot.prototype.setData = function(data) {
    // User needs to call updateBandPlot after this call

    // Data format:
    //   data.Y_label = "The Y label"
    //   data.path = [["G", "M"], ["M", "K"], ["K", "G"]], it's the default path
    //   data.paths = list of segment objects as described here below.
    //     each segment is an object: {from: "G", to: "M", values, x}
    //     - x has length N
    //     - x HAS an offset! You need to remove it if needed
    //     - values has length numbands * x

    this.data = data;
    if (typeof(this.myChart) != "undefined") {
        this.myChart.destroy();
    }
    this.initChart(this.divID);
    // Keep track of the current path to avoid too many refreshes
    this.currentPath = [];
};

BandPlot.prototype.initChart = function(divID) {
    var chartOptions = {
        chart: { type: 'line',
            zoomType: 'xy' },
        credits: {
            enabled: false,
        },
        title: { text: '' },
        xAxis: {
            tickPositioner: function() {return[];},
            lineWidth: 0
        }, // will be replaced
        yAxis: { plotLines: [],
            title: { text: ' ' , useHTML: true},// Leave text non-empty by default so it creates the object
            plotLines: [
                // uncomment to have a horizontal line at E=0
                // {value: 0, color: '#000000', width: 2}
            ]
        },
        tooltip: { formatter: function(x) { return 'y='+Math.round(this.y*100)/100 + "<br>Drag to zoom" } },
        legend: { enabled: false },
        series: [],
        plotOptions: {
            line:   { animation: true },
            series: {
                marker: {
                    states: {
                        select: {
                            fillColor: 'red',
                            radius: 5,
                            lineWidth: 0 }
                    }
                },
                cursor: 'pointer',
                /* allowPointSelect: true,
                 point: {
                 events: {
                 // select: select_event,
                 // unselect: unselect_event,
                 click: click_event
                 }
                 } */
            }
        }
    };

    this.myChart = Highcharts.chart(divID, chartOptions);
};

BandPlot.prototype.updateBandPlot = function(bandPath, forceRedraw) {

    // used later to reference the object inside subfunctions
    var bandPlotObject = this;

    if(forceRedraw == undefined)
        forceRedraw = false;

    var emptyOffset = 0.1; // used when a segment is missing

    // Decide whether to use the default path or the one specified as parameter
    if (typeof(bandPath) === 'undefined') {
        currentPathSpecification = bandPlotObject.data.path; // use the default path
    }
    else {
        currentPathSpecification = bandPath;
    }

    // Check if the path actually changed
    var hasChanged = false;
    if (bandPlotObject.currentPath.length != currentPathSpecification.length) {
        hasChanged = true;
    }
    else {
        zip(bandPlotObject.currentPath, currentPathSpecification).forEach(function(segmentSpec) {
            // Compare starting points of each segment
            if (segmentSpec[0][0] != segmentSpec[1][0]) {
                hasChanged = true;
            }
            // Compare ending points of each segment
            if (segmentSpec[0][1] != segmentSpec[1][1]) {
                hasChanged = true;
            }
        });
    }
    if ((!hasChanged) && (!forceRedraw)) {
        // do nothing if the path is the same
        return;
    }

    // Store the path in the internal cache
    bandPlotObject.currentPath = currentPathSpecification;

    // Function that picks a given segment among the full list
    // given the two extremes. Return the path subobject and a
    // boolean 'reverse' to say if we have to invert the path
    var pickSegment = function(segmentEdges, paths) {
        for (var i=0; i < paths.length; i++) {
            var path=paths[i];
            if ((path.from == segmentEdges[0]) && (path.to == segmentEdges[1])) {
                return {'segment': path, 'reverse': false}
            }
            else if ((path.from == segmentEdges[1]) && (path.to == segmentEdges[0])) {
                return {'segment': path, 'reverse': true}
            }
        }
        return null;
    }

    // Clean the plot removing the old bands
    for (var i = bandPlotObject.myChart.series.length - 1; i>=0 ; i--) {
        bandPlotObject.myChart.series[i].remove(redraw=false);
    }

    // Variable to keep track of the current position along x
    var currentXOffset = 0.;

    // Array that will contain [position, label] for each high-symmetry point encountered
    highSymmetryTicks = [];

    // Plot each of the segments
    currentPathSpecification.forEach(function(segmentEdges, segment_idx) {
        // Add a new high-symmetry point, if needed
        if (highSymmetryTicks.length == 0) {
            // First segment, add always
            highSymmetryTicks.push([currentXOffset, segmentEdges[0]]);
        }
        else {
            // Add only if different than the previous point (than, join the string
            // with a pipe)
            if (highSymmetryTicks[highSymmetryTicks.length-1][1] != segmentEdges[0]) {
                highSymmetryTicks[highSymmetryTicks.length-1][1] += "|" + segmentEdges[0];
            }
        }

        // Check which segment we need to plot
        var segmentInfo = pickSegment(segmentEdges, bandPlotObject.data.paths);
        if (segmentInfo) {
            // The segment was found, plot it

            // get the x array once, it's the same for all
            // make sure it starts from zero, and possibly reverse it if needed
            // (still will be from zero to a maximum value)
            var xArray = [];
            var xLength = segmentInfo.segment.x.length;
            if (segmentInfo.reverse) {
                for (var i=segmentInfo.segment.x.length - 1; i>=0; i--) {
                    xArray.push(segmentInfo.segment.x[xLength-1] - segmentInfo.segment.x[i]);
                }
            }
            else {
                for (var i=0; i<xLength; i++) {
                    xArray.push(segmentInfo.segment.x[i] - segmentInfo.segment.x[0]);
                }
            }

            // Should I use two colors? (By default, no). This info is returned
            // (in new versions of AiiDA) for each segment
            twoBandTypes = segmentInfo.segment.two_band_types || false;
            numBands = segmentInfo.segment.values.length;

            // If the path has no length (first point and last point coincide)
            // then I do not print. I check the x value at the last point
            // of xArray (xArray, in the lines above, is defined so that
            // xArray[0] = 0 and xArray[xArray.length-1] is the total
            // length of the array
            if (xArray[xArray.length-1] > 0) {

                // Plot each band of the segment
                segmentInfo.segment.values.forEach(function (band, band_idx) {
                    var curve = [];

                    if (segmentInfo.reverse) {
                        // need to use slice because reverse works in place and
                        // would modify the original array
                        var theBand = band.slice().reverse();
                    }
                    else {
                        var theBand = band;
                    }

                    zip(xArray, theBand).forEach(function (xy_point) {
                        curve.push(
                            [xy_point[0] + currentXOffset, xy_point[1]]);
                    });

                    if (twoBandTypes) {
                        if (band_idx * 2 < numBands) {
                            // Color for the first half of bands
                            lineColor = "#B2182B"; // dark red
                        }
                        else {
                            // Color for the second half of bands
                            lineColor = "#444444"; // dark grey
                        }
                    }
                    else {
                        lineColor = "#4682B4"; // dark blue
                    }

                    var series = {
                        name: segmentEdges[0] + "-" + segmentEdges[1] + "." + band_idx,
                        color: lineColor,
                        marker: {radius: 0, symbol: "circle"},
                        data: curve
                    }
                    bandPlotObject.myChart.addSeries(series, redraw = false);
                });
                currentXOffset += xArray[xArray.length - 1];
            }
            else {
                // If we are here, there is a segment, but its path has zero
                // length. Then, we just add also here the emptyOffset
                currentXOffset += emptyOffset;
            }
        }
        else {
            // segment is null, no segment was found - just leave some empty space
            currentXOffset += emptyOffset;
        }

        highSymmetryTicks.push([currentXOffset, segmentEdges[1]]);
    });
    // Reset the ticks etc.
    bandPlotObject.myChart.redraw(); // mush happen before changing ticks, axes, ...
    bandPlotObject.updateTicks(highSymmetryTicks);
    bandPlotObject.myChart.xAxis[0].setExtremes(0, currentXOffset);
    bandPlotObject.myChart.yAxis[0].axisTitle.attr({
        text: bandPlotObject.data.Y_label,
    });
},

// Update both ticks and vertical lines
// ticks should be in the format [xpos, label]
    BandPlot.prototype.updateTicks = function(ticks) {
        // I save the 'this' instance for later reference
        var bandPlotObject = this;

        //////////////////// Utility functions ///////////////////
        var labelFormatterBuilder = function(allData, ticks) {
            // Returns a function that is compatible with a
            // labelFormatter of highcharts.
            // In particular matches the x value with the label
            // also converts strings to prettified versions

            // pass both all the data (allData), used for the heuristics below
            // to determine the format for the prettifier, and the ticks array

            var label_info = {};
            for (var i=0; i<ticks.length; i++) {
                label_info[ticks[i][0]] = ticks[i][1];
            }

            // function to prettify strings (in HTML) with the new format defined in SeeK-path
            var prettifyLabelSeekpathFormat = function(label) {
                label = label.replace(/GAMMA/gi, "&Gamma;");
                label = label.replace(/DELTA/gi, "&Delta;");
                label = label.replace(/SIGMA/gi, "&Sigma;");
                label = label.replace(/LAMBDA/gi, "&Lambda;");
                label = label.replace(/\-/gi, "&mdash;");
                label = label.replace(/_(.)/gi, function(match, p1, offset, string) {
                    return "<sub>" + p1 + "</sub>"
                })
                return label;
            };
            // function to prettify strings (in HTML) with the old legacy format defined in AiiDA
            var prettifyLabelLegacyFormat = function(label) {
                // Replace G with Gamma
                if (label == 'G') {
                    label = "&Gamma;";
                }
                label = label.replace(/\-/gi, "&mdash;");
                // Replace digits with their lower-case version
                label = label.replace(/(\d+)/gi, function(match, p1, offset, string) {
                    return "<sub>" + p1 + "</sub>"
                })
                return label;
            };

            // Some heuristics to decide the prettify format
            // If there is "GAMMA", it is the new format
            // If there is NOT "GAMMA" and there is "G", it's the legacy format
            // If there is not even "G", then to be safe I use the seekpath format
            // that for instance does not make numbers subscripts by default
            var validNames = getValidPointNames(allData);
            var legacyFormat = false; // some default, should never be used anyway
            if (validNames.findIndex(function(label) {return label == "GAMMA"}) != -1) {
                // There is 'GAMMA': it is for sure the new format
                legacyFormat = false;
            }
            else {
                // GAMMA is not there
                if (validNames.findIndex(function(label) { return label == "G"}) != -1) {
                    // there is G: it's the legacy format
                    legacyFormat = true;
                }
            else {
                    // There is neither 'GAMMA' nor G: no idea, I assume the new format
                    legacyFormat = false;
                }
            }

            if (legacyFormat) {
                var prettifyLabel = prettifyLabelLegacyFormat;
            }
            else {
                var prettifyLabel = prettifyLabelSeekpathFormat;
            }

            // return the prettifier function
            return function() {
                // If not found returns 'undefined' that does not print anything
                raw_label = label_info[this.value];
                if (typeof(raw_label) === 'undefined') {
                    return raw_label;
                }
                label = prettifyLabel(raw_label);
                return label;
            }
        };

        // function that returns a function compatible with the tickPositioner of
        // Highcharts, returning the position of the ticks
        var tickPositionerBuilder = function(ticks) {
            var theTickPos = [];
            for (var i=0; i<ticks.length; i++) {
                theTickPos.push(ticks[i][0]);
            }
            return function() {
                // Important to make a copy, the library modifies the array
                var copyPositions = [];
                theTickPos.forEach(function(elem) {
                    copyPositions.push(elem);
                })
                return copyPositions;
            }
        }
        ////////////////// END OF UTILITY FUNCTIONS ///////////////////

        // First, clean the plot lines (vertical lines) and the old ticks
        bandPlotObject.myChart.xAxis[0].removePlotLine()
        for (var i=bandPlotObject.myChart.xAxis[0].ticks.length - 1; i>=0; i--) {
            bandPlotObject.myChart.xAxis[0].ticks[i].remove();
        }

        // Compute the tick positions
        var plotLines = [];
        var tickPos = [];
        for (var i=0; i<ticks.length ; i++ ) {
            tickPos.push(ticks[i][0]);
            plotLines.push({
                value: ticks[i][0],
                color: '#CCCCCC',
                width: 1
            })
        }

        // reset positions (in particular to set the tickPositioner)
        bandPlotObject.myChart.xAxis[0].setOptions(
            {
                plotLines: [],
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0,
                tickPositioner: tickPositionerBuilder(ticks),
                labels: {
                    useHTML: true,
                    align: "center",
                    style: { fontSize:'16px' }
                }
            });
        // set also the labelFormatter
        bandPlotObject.myChart.xAxis[0].labelFormatter = labelFormatterBuilder(bandPlotObject.data, ticks);
        bandPlotObject.myChart.xAxis[0].setTickPositions();
        ax = bandPlotObject.myChart.xAxis[0];
        bandPlotObject.myChart.render();
        // Important! Do after the render. Put back new vertical plotlines
        plotLines.forEach(function (plotLine) {
            bandPlotObject.myChart.xAxis[0].addPlotLine(plotLine);
        });
    };


