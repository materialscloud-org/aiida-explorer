// Generated on 2015-11-17 using generator-angular 0.11.1
"use strict";

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require("load-grunt-tasks")(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require("time-grunt")(grunt);

    var sass = require('node-sass');
    var serveStatic = require('serve-static');

    // url redirection
    var modRewrite = require('connect-modrewrite');
    // Configurable paths for the application
    var appConfig = {
        app: require("./bower.json").appPath || "app",
        dist: "dist",
        hostBackend: "http://localhost",
        hostAiidaProductionBackend: "https://aiida.materialscloud.org",
        hostAiidaDevelopmentBackend: "https://dev-aiida.materialscloud.org"
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        bowerdir: require('bower').config.directory,

        sass: {
            options: {
                compress: false,
                implementation: sass,
                includePaths: ['<%= bowerdir  %>/bootstrap-sass/assets/stylesheets', '<%= yeoman.app %>/styles/{,*/}*.scss']
            },
            compile: {
                files: {
                    '<%= yeoman.app %>/styles/css/theme.css': ['<%= yeoman.app %>/styles/sass/theme.scss']
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ["bower.json"],
                tasks: ["wiredep"]
            },
            js: {
                files: ["<%= yeoman.app %>/scripts/{,*/}*.js"],
                tasks: ["newer:jshint:all"],
                options: {
                    livereload: "<%= connect.options.livereload %>"
                }
            },
            jsTest: {
                files: ["test/spec/{,*/}*.js"],
                tasks: ["newer:jshint:test', 'karma"]
            },
            styles: {
                files: ["<%= yeoman.app %>/styles/css/{,*/}*.css"],
                tasks: ["newer:copy:styles"] //, "autoprefixer"]
            },
            sass: {
                files: ['<%= yeoman.app %>/styles/sass/{,*/}*.scss'],
                tasks: ['sass:compile']
            },
            gruntfile: {
                files: ["Gruntfile.js"]
            },
            livereload: {
                options: {
                    livereload: "<%= connect.options.livereload %>"
                },
                files: [
                    "<%= yeoman.app %>/{,*/}*.html",
                    ".tmp/styles/{,*/}*.css",
                    "<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}"
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 8000,
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect, options) {

                        return [
                            modRewrite([
                                //"/docs/(.+) /docs",
                                '!/mcloud|/styles|/app/styles|/bower_components|/docs|/data|\\.png|\\.jpeg|\\.gif|\\.html|\\.js|\\.css|\\‌​woff|\\‌​woff2|\\ttf|\\swf$ /index.html'
                            ]),
                            serveStatic(".tmp"),
                            connect().use(
                                "/bower_components",
                                serveStatic("./bower_components")
                            ),
                            connect().use(
                                "/explore/node_modules",
                                serveStatic("./node_modules")
                            ),
                            connect().use(
                                "/docs",
                                serveStatic("./docs")
                            ),
                            connect().use(
                                "/data",
                                serveStatic("./data")
                            ),
                            connect().use(
                                "/app/styles",
                                serveStatic("./app/styles")
                            ),
                            serveStatic(appConfig.app)
                        ];

                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            serveStatic(".tmp"),
                            serveStatic("test"),
                            connect().use(
                                "/bower_components",
                                serveStatic("./bower_components")
                            ),
                            connect().use(
                                "/docs",
                                serveStatic("./docs")
                            ),
                            connect().use(
                                "/data",
                                serveStatic("./data")
                            ),
                            connect().use(
                                "/app/styles",
                                serveStatic("./app/styles")
                            ),
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: "<%= yeoman.dist %>"
                }
            }
        },

        'string-replace': {
            dist: {
                files: {
                    '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
                },
                options: {
                    replacements: [{
                        pattern: '<base href="/">',
                        replacement: '<base href="/explore/">'
                    }]
                }
            }
        },

        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {\%= __ngModule %}',
                name: 'config',
                dest: '<%= yeoman.app %>/scripts/config.js'
            },
            dist: {
                constants: {
                    ENV: {
                        hostBackend: '<%= yeoman.hostBackend %>',
                        hostAiidaBackend: '<%= yeoman.hostAiidaDevelopmentBackend %>',
                        exploreOwnRestEndPoint: '',
                        commonRestEndPoint: '<%= yeoman.hostBackend %>/mcloud/api/v2',
                        profilesUrl: '<%= yeoman.hostBackend %>/mcloud/api/v2/explore/profiles',
                        logosUrl: '<%= yeoman.hostBackend %>/mcloud/api/v2/explore/logos'
                    }
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish"),
                ignores: ['<%= yeoman.app %>/scripts/external/{,*/}*.js']
            },
            all: {
                src: [
                    "Gruntfile.js",
                    "<%= yeoman.app %>/scripts/{,*/}*.js"
                ]
            },
            test: {
                options: {
                    jshintrc: "test/.jshintrc"
                },
                src: ["test/spec/{,*/}*.js"]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        ".tmp",
                        "<%= yeoman.dist %>/{,*/}*",
                        "!<%= yeoman.dist %>/.git{,*/}*"
                    ]
                }]
            },
            server: ".tmp"
        },

        // parses CSS and adds vendor-prefixed CSS properties
        // using the Can I Use database
        autoprefixer: {
            options: {
                browsers: ["last 1 version"]
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: ".tmp/styles/",
                    src: "*.css",
                    dest: ".tmp/styles/"
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: ".tmp/styles/",
                    src: "*.css",
                    dest: ".tmp/styles/"
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ["<%= yeoman.app %>/index.html"],
                ignorePath:  /\.\.\//
            },
            task: {
                src: ["<%= yeoman.app %>/views/**/*.html",   // .html support...
                    "<%= yeoman.app %>/*.html"   // .html support...
                ]
            },
            target: {
                src: ["<%= yeoman.app %>/views/**/*.html",   // .html support...
                    "<%= yeoman.app %>/*.html"   // .html support...
                ]
            },
            test: {
                devDependencies: true,
                src: "<%= karma.unit.configFile %>",
                ignorePath:  /\.\.\//,
                fileTypes:{
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: "\'{{filePath}}\',"
                        }
                    }
                }
            }
        },

        // added to update index.html automatically after installing new
        // package using bower
        bowerInstall: {
            target: {

                // Point to the files that should be updated when
                // you run `grunt bower-install`
                src: [
                    "<%= yeoman.app %>/views/**/*.html",   // .html support...
                    "<%= yeoman.app %>/*.html"   // .html support...
                ],

                // Optional:
                // ---------
                cwd: "",
                dependencies: true,
                devDependencies: false,
                exclude: [],
                fileTypes: {},
                ignorePath: "",
                overrides: {}
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    "<%= yeoman.dist %>/scripts/controllers/{,*/}*.js",
                    "<%= yeoman.dist %>/scripts/directives/{,*/}*.js",
                    "<%= yeoman.dist %>/scripts/filters/{,*/}*.js",
                    "<%= yeoman.dist %>/scripts/services/{,*/}*.js",
                    "<%= yeoman.dist %>/scripts/app.js",
                    //"<%= yeoman.dist %>/scripts/{,*/}*.js",
                    "<%= yeoman.dist %>/styles/{,*/}*.css",
                    //"<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}",
                    "<%= yeoman.dist %>/styles/fonts/*"
                ]
            }
        },

        // Renames files for browser caching purposes
        rev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: [
                        "<%= yeoman.dist %>/scripts/controllers/**/*.js",
                        "<%= yeoman.dist %>/scripts/directives/{,*/}*.js",
                        "<%= yeoman.dist %>/scripts/filters/{,*/}*.js",
                        "<%= yeoman.dist %>/scripts/services/{,*/}*.js",
                        "<%= yeoman.dist %>/scripts/*.js",
                        "<%= yeoman.dist %>/styles/css/*.css",
                        "<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}"
                        //"<%= yeoman.dist %>/styles/fonts/*"
                    ]
                }]
            }
        },


        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: "<%= yeoman.app %>/index.html",
            //html: ["<%= yeoman.app %>/{,*/}*.html"],
            //css: ["<%= yeoman.app %>/styles/{,*/}*.css"],
            //js: ["<%= yeoman.app %>/scripts/{,*/}*.js"],
            options: {
                dest: "<%= yeoman.dist %>"
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ["<%= yeoman.dist %>/**/*.html"],
            css: ["<%= yeoman.dist %>/styles/{,*/}*.css"],
            js: ["<%= yeoman.dist %>/{,*/}*.js"],
            options: {
                assetsDirs: [
                    "<%= yeoman.dist %>"
                ],
                patterns: {
                    js: [
                        [/(scripts\/(\w*\/)*[^''""]*\.(js))/g, 'Replacing references to js files'],
                        [/(styles\/(\w*\/)*[^''""]*\.(css))/g, 'Replacing references to css files']
                    ], //Scan js files to update reference
                    css: [
                        [/(images\/(\w*\/)*[^''""]*\.(png|jpg|jpeg|gif|svg))/g, 'Replacing references to images'],
                        [/(styles\/(\w*\/)*[^''""]*\.(ttf|woff|woff2))/g, 'Replacing references to fonts']
                    ], //Scan css files to update reference
                    html: [
                        [/(scripts\/(\w*\/)*[^''""]*\.(js))/g, 'Replacing references to js files'],
                        [/(styles\/(\w*\/)*[^''""]*\.(css))/g, 'Replacing references to css files'],
                        [/(images\/(\w*\/)*[^''""]*\.(png|jpg|jpeg|gif|svg))/g, 'Replacing references to images']
                    ] //Scan html files to update reference
                }
            }
        },

        // minifies JS files
        uglify: {
            options: {
                mangle: false,
                compress: false
            },
            dist: {
                options: {
                    mangle: false,
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: "<%= yeoman.app %>/scripts",
                    src: ["{,*/}*.js", '!{,*/}*.min.js'],
                    dest: "<%= yeoman.dist %>/scripts"
                }]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= yeoman.app %>/images",
                    src: "{,*/}*.{png,jpg,jpeg,gif}",
                    dest: "<%= yeoman.dist %>/images"
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= yeoman.app %>/images",
                    src: "{,*/}*.svg",
                    dest: "<%= yeoman.dist %>/images"
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: "<%= yeoman.dist %>",
                    src: ["*.html", "views/{,**/}*.html"],
                    dest: "<%= yeoman.dist %>"
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: ".tmp/scripts",
                    src: "{,*/}*.js",
                    dest: ".tmp/scripts"
                }]
            }
        },

        // comment root in options to add glyphicons in dist folder
        cssmin: {
            options: {
                //root: '<%= yeoman.app %>'
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist_data: {
                expand: true,
                cwd: "data/",
                src: "**/**/**/*",
                dest: "<%= yeoman.dist %>/data/"
            },
            dist_ngdocs: {
                expand: true,
                cwd: '.tmp/docs',
                dest: '<%= yeoman.dist %>/docs',
                src: [
                    '*.html',
                    'partials/{,*/}*.html',
                    'css/*.css',
                    'js/*.js',
                    'font/*',
                    'grunt-scripts/*'
                ]
            },
            dist_externalfiles: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= bowerdir %>/jstree/dist/themes/default',
                        src: '*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/styles'

                    }, {
                        expand: true,
                        cwd: "<%= bowerdir %>/bootstrap/dist",
                        src: "fonts/*",
                        dest: "<%= yeoman.dist %>"
                    }
                ]
            },
            dist_files: {
                expand: true,
                dot: true,
                cwd: "<%= yeoman.app %>",
                dest: "<%= yeoman.dist %>",
                src: [
                    "*.{ico,png,txt}",
                    ".htaccess",
                    "*.html",
                    "views/{,**/}*.html",
                    "images/{,*/}*.*",
                    "styles/fonts/{,*/}*.*",
                    "styles/css/mcloud_theme.min.css"
                ]

            },
            dist_scripts: {
                expand: true,
                cwd: "<%= yeoman.app %>/scripts",
                dest: "<%= yeoman.dist %>/scripts",
                src: "**/*"
            },
            dist_node_modules: {
                dest: "<%= yeoman.dist %>/",
                src: 'node_modules/bands-widget/dist/bandstructure.min.js'
            },
            styles: {
                expand: true,
                cwd: "<%= yeoman.app %>/styles/css/",
                dest: ".tmp/styles/",
                src: "*.css"
            },
            externalstyles: {
                expand: true,
                cwd: "<%= yeoman.app %>/styles/css/external",
                dest: "<%= yeoman.dist %>/styles/css/external",
                src: [
                    "{,*/}*.css",
                    "{,**/}*.ttf",
                    "{,**/}*.woff"
                ]
            },
            fonts: {
                expand: true,
                cwd:  "<%= bowerdir %>/bootstrap-sass/assets/fonts/bootstrap/",
                src: "*",
                dest: ".tmp/styles/fonts/"
            },
            ngdocs: {
                expand: true,
                cwd: '<%= yeoman.app %>/docs',
                dest: '.tmp/docs/',
                src: [
                    '*.{ico,png,txt}',
                    '.htaccess',
                    '*.html'
                ]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                "copy:styles"
            ],
            test: [
                "copy:styles"
            ],
            distprepare: [
                "copy:styles"
                //"copy:ngdocs"
                //"imagemin",
                //"svgmin"
            ],
            dist: [
                "copy:externalstyles",
                "copy:dist_data",
                //"copy:dist_ngdocs",
                "copy:dist_externalfiles",
                "copy:dist_files",
                "copy:dist_scripts",
                "copy:dist_node_modules"
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: "test/karma.conf.js",
                singleRun: true
            }
        },

        // Documentation
        ngdocs: {
            options: {
                dest: ".tmp/docs",
                html5Mode: true,
                startPage: '/api',
                title: "Materials Cloud",
                titleLink: "/docs/api",
                scripts: [
                    "bower_components/angular/angular.js",
                    "bower_components/angular-animate/angular-animate.js",
                    "app/scripts/app.js"
                ]
            },
            api: {
                src: ['app/scripts/**/**/**/*.js', 'app/docs/api/index.ngdoc'],
                title: 'API Documentation'
            },
            tutorial: {
                src: ['app/docs/tutorials/index.ngdoc'],
                title: "Tutorials"
            }
        }

    });


    grunt.registerTask("serve", "Compile then start a connect web server", function (target) {
        if (target === "dist") {
            return grunt.task.run([
                "build",
                "connect:dist:keepalive"
            ]);
        }

        grunt.task.run([
            "clean:server",
            "sass",
            "copy:fonts",
            //"copy:externalstyles",
            "ngconstant",
            //"ngdocs",
            //"wiredep",
            "concurrent:server",
            //"autoprefixer:server",
            "connect:livereload",
            "watch"
        ]);
    });

    grunt.registerTask("server", "DEPRECATED TASK. Use the 'serve' task instead", function (target) {
        grunt.log.warn("The `server` task has been deprecated. Use `grunt serve` to start a server.");
        grunt.task.run(["serve:" + target]);
    });

    grunt.registerTask("test", [
        "clean:server",
        //"wiredep",
        "concurrent:test",
        "autoprefixer",
        "connect:test",
        "karma"
        //"ngdocs"
    ]);

    grunt.registerTask("localbuild", [
        "clean:dist",
        "sass",
        'ngconstant',
        //"wiredep",
        "useminPrepare",
        "concurrent:distprepare",
        //"autoprefixer",
        "ngAnnotate",
        //"ngdocs",
        "concurrent:dist",
        "concat",
        "cssmin",
        "uglify",
        "rev",
        "usemin",
        "htmlmin"
    ]);

    grunt.registerTask("build", [
        "localbuild"
    ]);

    grunt.registerTask("build-mc", [
        "localbuild",
        "string-replace"
    ]);

    grunt.registerTask("default", [
        "newer:jshint",
        "test",
        "build",
        "wiredep"
    ]);
};
