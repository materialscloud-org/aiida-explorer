"use strict";

/**
 * @ngdoc service
 * @name materialsCloudApp.CONFIG
 * @description
 *
 * It stores all the constants used in materials cloud application.
 *
 * #### File location: app/scripts/services/mcloudconfig.js
 *
 */

app.constant("CONFIG", (function() {
    return {
        NODE_STATE_MAPPING: {
            "PROCESS": "main.explore.dashboard.grid.calculations",
            "CALCULATION": "main.explore.dashboard.grid.calculations",
            "DATA": "main.explore.dashboard.grid.data",
            "COMPUTER": "main.explore.dashboard.grid.computers",
            "CODE": "main.explore.dashboard.grid.codes"
        },
        NODE_LIMIT_PROVENANCE_BROWSER: 10,
        MESSAGE_TYPE: {
            SUCCESS: "alert-success",
            INFO: "alert-info",
            WARNING: "alert-warning",
            ERROR: "alert-danger"
        },
        EVENT_TYPE: {
            AUTH: {
                SIGNIN_SUCCESS: "auth:signin:success",
                SIGNIN_FAILURE: "auth:signin:failure",
                SIGNUP_SUCCESS: "auth:signup:success",
                SIGNUP_FAILURE: "auth:signup:failure",
                SIGNOUT_SUCCESS: "auth:signout:success",
                SIGNOUT_FAILURE: "auth:signout:failure",
                TOKEN_EXPIRED: "auth:token:expired"
            },
            NODE: {
                HTTP_FAILURE: "node:http:failure"
            }
        },
        CONSTANT: {
            AUTH: {
                TOKEN: "auth-token",
                EXPIRY_HOURS: 1,
                REST_SERVER_KEY: "user-server-end-point"
            }
        },
        REST_API: {
            SERVER: {
                BASE: "/server",
                ENDPOINTS: "/endpoints"
            },
            AUTH: {
                TOKEN: "/mcloud/token/",
                SIGNIN: "/mcloud/token/",
                SIGNOUT: "/api/logout",
                SIGNUP: "/mcloud/user/"
            },
            NODE: {
                V2: {
                    CALCULATION: "/calculations",
                    CALCULATION_SPECIFIC: "/calculations",
                    CALCJOB: "/calculations",
                    DATA: "/data",
                    CODE: "/codes",
                    COMPUTER: "/computers",
                    NODE: "/nodes",
                    USER: "/users",

                    SCHEMA: "/schema",
                    STATISTICS: "/statistics",
                    NODE_TYPES: "/types",
                    INPUTS: "/io/inputs",
                    OUTPUTS: "/io/outputs",
                    ATTRIBUTES: "/content/attributes",
                    EXTRAS: "/content/extras",
                    VISUALIZATION_XSF: "/content/visualization?visformat=xsf",
                    VISUALIZATION_CIF: "/content/visualization?visformat=cif",
                    VISUALIZATION_JSON: "/content/visualization",
                    VISUALIZATION: "/content/visualization",
                    DOWNLOAD: "/content/download",
                    IO_TREE: "/io/tree",
                    RETRIEVED_INPUTS: "/io/retrieved_inputs",
                    RETRIEVED_OUTPUTS: "/io/retrieved_outputs"
                },
                V3: {
                    CALCULATION: "/calculations",
                    CALCULATION_SPECIFIC: "/calculations",
                    PROCESS: "/calculations",
                    CALCJOB: "/calculations",
                    DATA: "/data",
                    CODE: "/nodes",
                    COMPUTER: "/computers",
                    NODE: "/nodes",
                    USER: "/users",

                    SCHEMA: "/schema",
                    STATISTICS: "/statistics",
                    NODE_TYPES: "/types",
                    INPUTS: "/io/inputs",
                    OUTPUTS: "/io/outputs",
                    ATTRIBUTES: "/content/attributes",
                    EXTRAS: "/content/extras",
                    VISUALIZATION_XSF: "/content/visualization?visformat=xsf",
                    VISUALIZATION_CIF: "/content/visualization?visformat=cif",
                    VISUALIZATION_JSON: "/content/visualization",
                    VISUALIZATION: "/content/visualization",
                    DOWNLOAD: "/content/download",
                    IO_TREE: "/io/tree",
                    RETRIEVED_INPUTS: "/io/retrieved_inputs",
                    RETRIEVED_OUTPUTS: "/io/retrieved_outputs"
                },
                V4: {
                    CALCULATION: "/nodes",
                    PROCESS: "/nodes",
                    CALCULATION_SPECIFIC: "/processes",
                    CALCJOB: "/calcjobs",
                    DATA: "/nodes",
                    CODE: "/nodes",
                    COMPUTER: "/computers",
                    NODE: "/nodes",
                    USER: "/users",

                    SCHEMA: "/projectable_properties",
                    STATISTICS: "/statistics",
                    FULL_TYPES_STATISTICS: "/full_types_count",
                    NODE_TYPES: "/full_types",
                    INPUTS: "/links/incoming",
                    OUTPUTS: "/links/outgoing",
                    ATTRIBUTES: "/contents/attributes",
                    EXTRAS: "/contents/extras",
                    DOWNLOAD_FORMATS: "/download_formats",
                    VISUALIZATION_XSF: "/download?download_format=xsf&download=False",
                    VISUALIZATION_CIF: "/download?download_format=cif&download=False",
                    VISUALIZATION_JSON: "/download?download_format=json&download=False",
                    VISUALIZATION: "/contents/derived_properties",
                    DOWNLOAD: "/download",
                    IO_TREE: "/links/tree",
                    RETRIEVED_INPUTS: "/input_files",
                    RETRIEVED_OUTPUTS: "/output_files",
                    REPO_CONTENTS: "/repo/contents"
                }
            }
        },
        GRID: {
            FILTER_OPERATOR_MAPPER: {
                STRING: {
                    IS_EQUAL_TO: {display_name: "Is equal to", mapper: "="},
                    IS_NOT_EQUAL_TO: {display_name: "Is not equal to", mapper: "!="},
                    STARTSWITH: {display_name: "Starts with", mapper: '=like="VALUE%"'},
                    CONTAINS: {display_name: "Contains", mapper: '=like="%VALUE%"'},
                    DOES_NOT_CONTAIN: {display_name: "Does not contain", mapper: ""},
                    ENDSWITH: {display_name: "Ends with", mapper: '=like="%VALUE"'}
                },
                NUMBER: {
                    IS_EQUAL_TO: {display_name: "==", mapper: "="},
                    IS_NOT_EQUAL_TO: {display_name: "!=", mapper: "!="},
                    IS_GREATER_THAN_OR_EQUAL_TO: {display_name: ">=", mapper: ">="},
                    IS_GREATER_THAN: {display_name: ">", mapper: ">"},
                    IS_LESS_THAN_OR_EQUAL_TO: {display_name: "<=", mapper: "<="},
                    IS_LESS_THAN: {display_name: "<", mapper: "<"},
                    IS_NULL: {display_name: "Is null", mapper: ""},
                    IS_NOT_NULL: {display_name: "Is not null", mapper: ""}
                },
                DATE: {
                    IS_EQUAL_TO: {display_name: "==", mapper: "="},
                    IS_NOT_EQUAL_TO: {display_name: "!=", mapper: "!="},
                    IS_GREATER_THAN_OR_EQUAL_TO: {display_name: ">=", mapper: ">="},
                    IS_GREATER_THAN: {display_name: ">", mapper: ">"},
                    IS_LESS_THAN_OR_EQUAL_TO: {display_name: "<=", mapper: "<="},
                    IS_LESS_THAN: {display_name: "<", mapper: "<"}
                }
            },
            FILTERS_V2: {
                // calculations
                TYPE_COLUMN_NAME: "type",
                TYPE_OPERATOR: "STARTSWITH",
                CALCULATION: {field:"type", fieldType:"STRING", operator:"STARTSWITH",value:""},
                QUANTUMESPRESSOPW: {field:"type", fieldType:"STRING", operator:"STARTSWITH",value:"calculation.job.quantumespresso.pw."},
                QUANTUMESPRESSOPH: {field:"type", fieldType:"STRING", operator:"STARTSWITH",value:"calculation.job.quantumespresso.ph."},
                INLINE: {field:"type", fieldType:"STRING", operator:"STARTSWITH",value:"calculation.inline."},
                WANNIER90: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.wannier90"},
                EXCITING: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.exciting"},
                CP2K: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.cp2k"},
                SIESTA: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.siesta"},
                YAMBO: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.yambo"},
                CODTOOLS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.codtools"},

                // data nodes
                DATA: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:""},
                STRUCTURES: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.structure.StructureData."},
                CIF: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.cif.CifData."},
                PARAMETERS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.parameter.ParameterData."},
                KPOINTS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array.kpoints.KpointsData."},
                UPF: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.upf.UpfData."},
                REMOTE: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.remote.RemoteData."},
                TRAJECTORY: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array.trajectory.TrajectoryData."},
                BANDS: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array.bands.BandsData."},
                ARRAY: {field:"type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array."},

                // computers
                EPFL: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"epfl.ch"},
                CSCS: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"cscs.ch"}
            },
            FILTERS_V3: {
                // calculations
                TYPE_COLUMN_NAME: "node_type",
                TYPE_OPERATOR: "STARTSWITH",
                CALCULATION: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH",value:""},
                QUANTUMESPRESSOPW: {field:"process_type", fieldType:"STRING", operator:"STARTSWITH",value:"aiida.calculations:quantumespresso.pw"},
                QUANTUMESPRESSOPH: {field:"process_type", fieldType:"STRING", operator:"STARTSWITH",value:"aiida.calculations:quantumespresso.ph"},
                INLINE: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH",value:"process.calculation.calcfunction.CalcFunctionNode."},
                WANNIER90: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.wannier90"},
                EXCITING: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.exciting"},
                CP2K: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.cp2k"},
                SIESTA: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.siesta"},
                YAMBO: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.yambo"},
                CODTOOLS: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"calculation.job.codtools"},

                // data nodes
                DATA: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:""},
                STRUCTURES: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.structure.StructureData."},
                CIF: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.cif.CifData."},
                PARAMETERS: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.parameter.ParameterData."},
                KPOINTS: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array.kpoints.KpointsData."},
                UPF: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.upf.UpfData."},
                REMOTE: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.remote.RemoteData."},
                TRAJECTORY: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array.trajectory.TrajectoryData."},
                BANDS: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array.bands.BandsData."},
                ARRAY: {field:"node_type", fieldType:"STRING", operator:"STARTSWITH", value:"data.array."},

                // computers
                EPFL: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"epfl.ch"},
                CSCS: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"cscs.ch"}
            },
            FILTERS_V4: {
                // calculations
                TYPE_COLUMN_NAME: "full_type",
                TYPE_OPERATOR: "IS_EQUAL_TO",
                CALCULATION: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO",value:"process.%|%"},
                PROCESS: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO",value:"process.%|%"},
                // data nodes
                DATA: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.%|"},
                STRUCTURES: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.structure.StructureData."},
                CIF: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.cif.CifData."},
                PARAMETERS: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.parameter.ParameterData."},
                KPOINTS: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.array.kpoints.KpointsData."},
                UPF: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.upf.UpfData."},
                REMOTE: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.remote.RemoteData."},
                TRAJECTORY: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.array.trajectory.TrajectoryData."},
                BANDS: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.array.bands.BandsData."},
                ARRAY: {field:"full_type", fieldType:"STRING", operator:"IS_EQUAL_TO", value:"data.array."},

                // computers
                EPFL: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"epfl.ch"},
                CSCS: {field:"hostname", fieldType:"STRING", operator:"ENDSWITH", value:"cscs.ch"}
            },
            DEFAULT_ORDER: {
                CALCULATION: "-ctime",
                PROCESS: "-ctime",
                DATA: "-ctime",
                CODE: "-ctime"
            },
            COLUMN_WIDTHS: {
                ID: "80px",
                COMMAND: "100px"
            },
            NODE_TYPES: {
                V2: {
                    CALCULATION: "CALCULATION"
                },
                V3: {
                    CALCULATION: "CALCULATION"
                },
                V4: {
                    CALCULATION: "PROCESS"
                }
            },
            NODE_TYPES_ORDER: [
                "calculation", "process", "data", "code"
            ]
        },
        DATA_PATH: {
            V2: {
                CALCULATION: "calculations",
                DATA: "data",
                CODE: "codes",
                COMPUTER: "computers",
                NODE: "nodes",
                VISUALIZATION: "visualization",
                DERIVED_PROPERTIES: "visualization",
                ATTRIBUTES: "attributes",
                RETRIEVED_INPUTS: "retrieved_inputs",
                RETRIEVED_OUTPUTS: "retrieved_outputs"
            },
            V3: {
                CALCULATION: "calculations",
                PROCESS: "calculations",
                DATA: "data",
                CODE: "codes",
                COMPUTER: "computers",
                NODE: "nodes",
                VISUALIZATION: "visualization",
                DERIVED_PROPERTIES: "visualization",
                ATTRIBUTES: "attributes",
                RETRIEVED_INPUTS: "retrieved_inputs",
                RETRIEVED_OUTPUTS: "retrieved_outputs"
            },
            V4: {
                CALCULATION: "nodes",
                PROCESS: "nodes",
                DATA: "nodes",
                CODE: "nodes",
                COMPUTER: "computers",
                NODE: "nodes",
                VISUALIZATION: "download",
                DERIVED_PROPERTIES: "derived_properties",
                ATTRIBUTES: "attributes",
                RETRIEVED_INPUTS: "data",
                RETRIEVED_OUTPUTS: "data",
                INCOMING: "incoming",
                OUTGOING: "outgoing"
            }
        },
        DISPLAY_NAMES: {
            V2: {
            // calculations
            "calculation.job.quantumespresso.matdyn.MatdynCalculation.": "Matdyn",
            "calculation.job.castep.castep.CastepCalculation.": "Castep",
            "calculation.job.quantumespresso.pw.PwCalculation.": "Quantum ESPRESSO-PW",
            "calculation.job.quantumespresso.ph.PhCalculation.": "Quantum ESPRESSO-PH",
            "calculation.job.codtools.ciffilter.CiffilterCalculation.": "Codtools-ciffilter",
            "calculation.inline.InlineCalculation.": "Inline calculation",
            "calculation.job.wannier90.Wannier90Calculation.": "Wannier90",

            // data nodes
            "data.structure.StructureData.": "Structure",
            "data.parameter.ParameterData.": "Parameter",
            "data.array.ArrayData.": "Array",
            "data.array.kpoints.KpointsData.": "Kpoints",
            "data.array.trajectory.TrajectoryData.": "Trajectory",
            "data.orbital.OrbitalData.": "Orbital",
            "data.upf.UpfData.": "Upf",
            "data.remote.RemoteData.": "Remote",
            "data.cif.CifData.": "Cif",
            "data.folder.FolderData.": "Folder",
            "data.array.bands.BandsData.": "Bands",
            "data.singlefile.SinglefileData.": "Singlefile",
            "CALCULATION": "Calculation",
            "DATA": "Data",
            "CODE": "Code",
            "code.Code.": "Code",
            "COMPUTER": "Computer"
            },
            V3: {
            // calculations
            "calculation.job.quantumespresso.matdyn.MatdynCalculation.": "Matdyn",
            "calculation.job.castep.castep.CastepCalculation.": "Castep",
            "calculation.job.quantumespresso.pw.PwCalculation.": "Quantum ESPRESSO-PW",
            "calculation.job.quantumespresso.ph.PhCalculation.": "Quantum ESPRESSO-PH",
            "calculation.job.codtools.ciffilter.CiffilterCalculation.": "Codtools-ciffilter",
            "calculation.inline.InlineCalculation.": "Inline calculation",
            "calculation.job.wannier90.Wannier90Calculation.": "Wannier90",

            // data nodes
            "data.structure.StructureData.": "Structure",
            "data.parameter.ParameterData.": "Parameter",
            "data.array.ArrayData.": "Array",
            "data.array.kpoints.KpointsData.": "Kpoints",
            "data.array.trajectory.TrajectoryData.": "Trajectory",
            "data.orbital.OrbitalData.": "Orbital",
            "data.upf.UpfData.": "Upf",
            "data.remote.RemoteData.": "Remote",
            "data.cif.CifData.": "Cif",
            "data.folder.FolderData.": "Folder",
            "data.array.bands.BandsData.": "Bands",
            "data.singlefile.SinglefileData.": "Singlefile",
            "CALCULATION": "Calculation",
            "DATA": "Data",
            "CODE": "Code",
            "code.Code.": "Code",
            "COMPUTER": "Computer"
            },
            V4: {
            // calculations
            "calculation.job.quantumespresso.matdyn.MatdynCalculation.": "Matdyn",
            "calculation.job.castep.castep.CastepCalculation.": "Castep",
            "calculation.job.quantumespresso.pw.PwCalculation.": "Quantum ESPRESSO-PW",
            "calculation.job.quantumespresso.ph.PhCalculation.": "Quantum ESPRESSO-PH",
            "calculation.job.codtools.ciffilter.CiffilterCalculation.": "Codtools-ciffilter",
            "calculation.inline.InlineCalculation.": "Inline calculation",
            "calculation.job.wannier90.Wannier90Calculation.": "Wannier90",

            // data nodes
            "data.structure.StructureData.": "Structure",
            "data.dict.Dict.": "Parameter",
            "data.array.ArrayData.": "Array",
            "data.array.kpoints.KpointsData.": "Kpoints",
            "data.array.trajectory.TrajectoryData.": "Trajectory",
            "data.orbital.OrbitalData.": "Orbital",
            "data.upf.UpfData.": "Upf",
            "data.remote.RemoteData.": "Remote",
            "data.cif.CifData.": "Cif",
            "data.folder.FolderData.": "Folder",
            "data.array.bands.BandsData.": "Bands",
            "data.singlefile.SinglefileData.": "Singlefile",
            "CALCULATION": "Calculation",
            "DATA": "Data",
            "CODE": "Code",
            "code.Code.": "Code",
            "COMPUTER": "Computer"
            }
        },
        SIDE_MENU_DEFAULTS: {
            calculation: [
                {display_name: "Inline calculation", filter_name: "calculation.inline.InlineCalculation."},
                {display_name: "Quantum ESPRESSO-PH", filter_name: "calculation.job.quantumespresso.ph.PhCalculation."},
                {display_name: "Quantum ESPRESSO-PW", filter_name: "calculation.job.quantumespresso.pw.PwCalculation."},
            ],
            code: [
                {display_name: "Code", filter_name: "code.Code."}
            ],
            data: [
                {display_name: "Array", filter_name: "data.array.ArrayData."},
                {display_name: "Bands", filter_name: "data.array.bands.BandsData."},
                {display_name: "Kpoints", filter_name: "data.array.kpoints.KpointsData."},
                {display_name: "Trajectory", filter_name: "data.array.trajectory.TrajectoryData."},
                {display_name: "Cif", filter_name: "data.cif.CifData."},
                {display_name: "Folder", filter_name: "data.folder.FolderData."},
                {display_name: "Parameter", filter_name: "data.parameter.ParameterData."},
                {display_name: "Remote", filter_name: "data.remote.RemoteData."},
                {display_name: "Structure", filter_name: "data.structure.StructureData."},
                {display_name: "Upf", filter_name: "data.upf.UpfData."}
            ]
        },
        NODE_DETAILS: {
            TEMPLATES: {
                V2: {
                    CALCULATION: {
                        default: "INLINE",
                        "calculation.inline.InlineCalculation.": "INLINE",
                        "calculation.work.WorkCalculation.": "INLINE",
                        "process.calculation.calcfunction.CalcFunctionNode.": "INLINE"
                    },
                    DATA: {
                        "data.structure.StructureData.": "STRUCTURES",
                        "data.array.bands.BandsData.": "BANDS",
                        "data.array.kpoints.KpointsData.": "KPOINTS",
                        "data.upf.UpfData.": "UPF",
                        "data.cif.CifData.": "CIF"
                    },
                    CODE: {
                        // add here
                    },
                    NODE: {

                    }
                },
                V3: {
                    CALCULATION: {
                        default: "INLINE",
                        "calculation.inline.InlineCalculation.": "INLINE",
                        "calculation.work.WorkCalculation.": "INLINE",
                        "process.calculation.calcfunction.CalcFunctionNode.": "INLINE"
                    },
                    PROCESS: {
                        default: "INLINE",
                        "calculation.inline.InlineCalculation.": "INLINE",
                        "calculation.work.WorkCalculation.": "INLINE",
                        "process.calculation.calcfunction.CalcFunctionNode.": "INLINE",
                        "process.workflow.workchain.WorkChainNode.": "WORKCHAIN"
                    },
                    DATA: {
                        "data.structure.StructureData.": "STRUCTURES",
                        "data.array.bands.BandsData.": "BANDS",
                        "data.array.kpoints.KpointsData.": "KPOINTS",
                        "data.upf.UpfData.": "UPF",
                        "data.cif.CifData.": "CIF"
                    },
                    CODE: {
                        // add here
                    },
                    NODE: {

                    }
                },
                V4: {
                    PROCESS: {
                        default: "INLINE",
                        "process.calculation.calcfunction.CalcFunctionNode.": "INLINE",
                        "process.calculation.calcjob.CalcJobNode.": "CALCULATION",
                        "process.workflow.workfunction.WorkFunctionNode.": "INLINE",
                        "process.workflow.workchain.WorkChainNode.": "WORKCHAIN"
                    },
                    DATA: {
                        "data.structure.StructureData.": "STRUCTURES",
                        "data.array.bands.BandsData.": "BANDS",
                        "data.array.kpoints.KpointsData.": "KPOINTS",
                        "data.upf.UpfData.": "UPF",
                        "data.cif.CifData.": "CIF"
                    },
                    CODE: {
                        // add here
                    },
                    NODE: {

                    }
                }
            }
        }
    };
})());
{}
