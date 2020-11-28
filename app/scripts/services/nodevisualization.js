"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.nodeVisualization
 * @description
 *
 * This service provides different methods to visualize node.
 *
 * #### File location: app/scripts/services/nodevisualization.js
 *
 */

angular.module("materialsCloudApp").factory("nodeVisualization",
    [ function () {

        var myVisualization = {

            jsonReplacer: function (match, pIndent, pKey, pVal, pEnd) {
                var key = "<span class=json-key>";
                var val = "<span class=json-value>";
                var str = "<span class=json-string>";
                var r = pIndent || "";
                if (pKey) {
                    r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
                }
                if (pVal) {
                    // check if it is a string
                    if (pVal[0] == '"') {
                        // check if it is a url
                        if (pVal[1] == '/') {

                            // split and extract its nodetype and nodeid
                            var tmp = pVal.split("/");
                            var nodeType = tmp[3];
                            var nodeId = tmp[4];

                            // TODO: remove hardcoded condition for dbuser
                            // TODO: update it after implementing authentication module
                            if (nodeType != "dbuser" && (!isNaN(parseInt(nodeId)) && isFinite(nodeId))) {
                                //var tmp1 = "$state.go('nodedetails',{'nodeType':" \
                                // + nodeType + ",'nodeId':" + nodeId + "})";
                                var tmp1 = "changeState(" + pVal + ")";
                                r = r + '<span class=json-sref ng-click=' + tmp1 + '>' + pVal + '</span>';
                            }

                            // it is dbuser so display it is string only
                            else {
                                r = r + str + pVal + '</span>';
                            }
                        }
                        // it is string and not url
                        else {
                            r = r + str + pVal + '</span>';
                        }
                    }
                    // it is not a string so display it as value
                    else {
                        r = r + val + pVal + '</span>';
                    }
                }
                return r + (pEnd || '');
            },

            jsonPrettyPrint: function (obj) {
                var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
                return JSON.stringify(obj, null, 6)
                    .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(jsonLine, myVisualization.jsonReplacer);
            },

            getValueHtmlEle: function (type, value) {
                value = $.trim(value);
                if (type === String) {
                    // check if it is a url
                    if (value[0] == '/') {

                        // split and extract its nodetype and nodeid
                        var tmp1 = value.split("/");
                        var nodeType = tmp1[3];
                        var nodeId = tmp1[4];

                        // TODO: remove hardcoded condition for dbuser
                        // TODO: update it after implementing authentication module
                        if (nodeType != "dbuser" && (!isNaN(parseInt(nodeId)) && isFinite(nodeId))) {
                            return ("<span class='value json-sref' ng-click=changeState('" + value + "')>" +
                                value + "</span>");
                        }
                        // it is dbuser so display it as string only
                        else {
                            return ("<span class='value json-string'>" + $.trim(value) + "</span>");
                        }
                    }
                    // it is string and not url
                    else {
                        return ("<span class='value json-string'>" + $.trim(value) + "</span>");
                    }
                }
                else {
                    return ("<span class='value json-value'>" + $.trim(value) + "</span>");
                }
            },

            formattedList: function (data, tmp, excludeList) {
                var valType = "";
                $.each(data, function (key, value) {
                    var exclude = false;
                    if(excludeList !== undefined && excludeList.length > 0){
                        $.each(excludeList, function(index, exVal){
                            if(key == exVal){
                                exclude = true;
                                return false;
                            }
                        });
                        if(exclude){
                            return true;
                        }
                    }

                    var tmpKey = key;
                    if (key.constructor === String) {
                        tmpKey = key.charAt(0).toUpperCase() + key.slice(1);
                    }
                    tmp.push("<div class=metadata><span class='title json-key'>" + tmpKey + ": </span>");

                    if (value !== null) {
                        valType = value.constructor;
                        if (valType === Array) {
                            tmp.push("[");
                            if (value[0] !== undefined) {
                                if (value[0].constructor === Array || value[0].constructor === Object) {
                                    tmp.push("<div class=metadata-inner>");
                                    tmp.concat(myVisualization.formattedList(value, tmp));
                                    tmp.push("</div>");
                                }
                                else {
                                    tmp.push("<div class=metadata-inner>");
                                    var firstElement = true;
                                    $.each(value, function (key1, value1) {
                                        if (firstElement) {
                                            firstElement = false;
                                        }
                                        else {
                                            tmp.push("</br>");
                                        }
                                        tmp.push(myVisualization.getValueHtmlEle(value1.constructor, value1) + ",");
                                    });
                                    tmp.push("</br>");
                                    tmp.push("</div>");
                                }
                            } // end of: value is not undefined
                            else {
                                tmp.concat(myVisualization.formattedList(value, tmp));
                            }
                            tmp.push("]");
                        } // end array valType
                        else if (valType === Object) {
                            tmp.push("<div class=metadata-inner>");
                            tmp.concat(myVisualization.formattedList(value, tmp));
                            tmp.push("</div>");
                        }
                        else {
                            tmp.push(myVisualization.getValueHtmlEle(valType, value));
                        }
                    } // end of value is not null
                    else {
                        tmp.push("");
                    }
                    tmp.push("</div>");
                });
                return tmp;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.nodeVisualization#chemDoodleCrystal
             * @methodOf materialsCloudApp.nodeVisualization
             *
             * @description
             *  It displays the structure using chemDoodle JS library.
             *
             * @param {object} data structure data.
             * @param {string} format of structure data ('cif' or 'json')
             * @param {string} htmlId html element id where structure will be displayed.
             * @param {string} parentHtmlId parent html id to set height and width of the canvas.
             * @param {object} structureviewer structure viewer object.
             *
             * @returns {object} structure viewer object.
             */
            chemDoodleCrystal: function (data, format, htmlId, parentHtmlId, structureviewer) {

                // processing
                var parentcanvas = document.getElementById(parentHtmlId);
                var the_width = parentcanvas.offsetWidth - 10;
                var the_height = parentcanvas.offsetHeight - 10;

                structureviewer = new ChemDoodle.TransformCanvas3D(htmlId, the_width, the_height);
                structureviewer.emptyMessage = 'Loading data...';
                structureviewer.specs.set3DRepresentation('Ball and Stick');
                structureviewer.specs.projectionPerspective_3D = false;
                structureviewer.specs.backgroundColor = 'white';
                structureviewer.specs.shapes_color = '#111';
                structureviewer.specs.projectionFrontCulling_3D = 0.01;
                structureviewer.specs.projectionBackCulling_3D = 10000;

                if (format == 'json') {
                    var chemstructure = new ChemDoodle.io.JSONInterpreter().contentFrom(data);
                    new ChemDoodle.informatics.BondDeducer().deduceCovalentBonds(chemstructure['molecules'][0], 1);
                    structureviewer.center = function () {}; // Disable ChemDoodle recentering of molecule (not consistent with cell, uses different recenterings...)

                    structureviewer.specs.atoms_displayLabels_3D = true;
                    structureviewer.loadContent(chemstructure['molecules'], chemstructure['shapes']);
                } else if ( format == 'cif') {
                    // read unit cell (1x1x1)
                    var cif = ChemDoodle.readCIF(data, 1,1,1);
                    // This is a workaround, where the bonds are deduced
                    // TODO: If present, we should be using the CIF bonds,
                    // but we need figure out how to remove "periodic" bonds
                    cif.molecule.bonds = []; //
                    new ChemDoodle.informatics.BondDeducer().deduceCovalentBonds(cif.molecule, 1);

                    structureviewer.loadContent([cif.molecule], [cif.unitCell]);
                }

                structureviewer.setupScene();

                return structureviewer;
            },

            /**
             * @ngdoc
             * @name materialsCloudApp.nodeVisualization#jsmolCrystal
             * @methodOf materialsCloudApp.nodeVisualization
             *
             * @description
             *  It displays the structure using JSmol library.
             *
             * @param {object} data structure data.
             * @param {string} parentHtmlId parent html id to set height and width of the canvas.
             * @param {object} jsmolStructureviewer structure viewer object.
             *
             * @returns {object} jsmolStructureviewer viewer object.
             */
            jsmolCrystal: function (data, parentHtmlId, appletName, supercellOptions) {

                var parentDiv = document.getElementById(parentHtmlId);
                var the_width = parentDiv.offsetWidth - 5;
                var the_height = parentDiv.offsetHeight - 5;

                var Info = {
                    width: the_width,
                    height: the_height,
                    debug: false,
	                color: "#FFFFFF",
	                use: "HTML5",
                    j2sPath: "scripts/external/jsmol/j2s",
                    serverURL: "scripts/external/jsmol/php/jsmol.php",
                    console: "jmolApplet_infodiv"
                };

                var jsmolStructureviewer = Jmol.getApplet(appletName, Info);

                if (supercellOptions === undefined){
                    var loadingScript = 'color cpk; load INLINE "' + data + '" packed; wireframe 0.15; spacefill 23%';
                } else {
                    var loadingScript = 'color cpk; load INLINE "' + data + '" {' + supercellOptions[0] + ' ' + supercellOptions[1] + ' ' + supercellOptions[2] + '} packed; wireframe 0.15; spacefill 23%';
                }

                //draw x,y,z axes instead of a,b,c vectors as default
                loadingScript+= '; axes off; draw xaxis ">X" vector {0 0 0} {2 0 0} color red width 0.15; draw yaxis ">Y" vector {0 0 0} {0 2 0} color green width 0.15; draw zaxis ">Z" vector {0 0 0} {0 0 2} color blue width 0.15';

                //do not show info on top left
                loadingScript+= '; unitcell primitive';

                //Sets the unit cell line diameter in Angstroms
                loadingScript+= '; unitcell 2';

                // antialiasDisplay ON
                loadingScript+= '; set antialiasDisplay on';

                //Zooms to the setting that fills the screen with the currently displayed atoms
                loadingScript+= "; set zoomLarge false";

                //remove JSmol logo
                loadingScript+= '; set frank off';

                Jmol.script(jsmolStructureviewer, loadingScript);

                //Jmol.setDocument(0);

                //parentDiv.innerHTML = Jmol.getAppletHtml(jsmolStructureviewer);
                //$("#" + parentHtmlId).html(Jmol.getAppletHtml(jsmolStructureviewer));

                return jsmolStructureviewer;
            }

        };

        return myVisualization;
    }
    ]);
