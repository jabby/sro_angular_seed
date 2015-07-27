module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            allFiles: [
                'app/**/*.js',
                '!app/templates.js',
                '!app/vendors/**/*.js'
            ],
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            }
        },
        ngtemplates: {
            website: {
                src: ['app/**/*.html'],
                dest: 'app/templates.js',
                standalone: true,
                options: {
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            strict: {
                options: {
                    import: 2
                },
                src: [
                    'app/**/*.css',
                    '!app/vendors/**/*.css'
                ]
            }
        },
        concat: {
            css: {
                src: [
                    'app/**/*.css'
                ],
                dest: 'dist/style-css.css'
            },
            sass: {
                src: [
                    'app/**/*.scss'
                ],
                dest: 'dist/style-scss.scss'
            },
            'sass-css': {
                src: [
                    'dist/style-scss.css',
                    'dist/style-css.css'
                ],
                dest: 'dist/style.css'
            },
            'js-not-min': {
                src: [
                    "app/app.js",
                    "app/**/*.js",
                    "!app/vendors/**/*.min.js"
                ],
                dest: 'dist/script.js'
            },
            'js-min': {
                src: [
                    "app/vendors/js/angular.min.js",
                    "app/vendors/**/*.min.js",
                    "dist/script.min.js"
                ],
                dest: 'dist/script.min.js'
            }
        },
        autoprefixer: {
            single_file: {
                src: 'dist/style.css',
                dest: 'dist/style.css'
            }
        },
        cssmin: {
            css: {
                src: 'dist/style.css',
                dest: 'dist/style.min.css'
            }
        },
        uglify: {
            js: {
                options: {
                    sourceMap: false,
                    sourceMapName: 'dist/script.min.js.map'
                },
                files: {
                    'dist/script.min.js': ['dist/script.js']
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            application: {
                files: {
                    'dist/script.js': ['dist/script.js']
                }
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: "none",
                    style: "expanded"
                },
                files: [
                    {
                        'dist/style-scss.css': 'dist/style-scss.scss'
                    }
                ]
            }
        },
        watch: {
            html: {
                files: ['app/**/*.html'],
                tasks: ['ngtemplates']
            },
            css: {
                files: ['app/**/*.css', 'app/**/*.scss'],
                tasks: ['generateCSS']
            },
            js: {
                files: ['app/**/*.js'],
                tasks: ['concat:js-not-min', 'ngAnnotate', 'uglify:js', 'concat:js-min', 'jshint', 'clean:end-build'],
                options: {
                    interrupt: true
                }
            },
            livereload: {
                files: ['dist/*.min.*', 'index.html'],
                options: {livereload: true}
            }
        },
        copy: {
            cssVendorFiles: {
                src: [
                    'app/vendors/css/*.css'
                ],
                dest: 'assets/vendors/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
        },
        clean: {
            assets: ["assets/"],
            dist: ["dist/"],
            "end-build": [
                'dist/style.css',
                'dist/script.js',
                'dist/style-css.css',
                'dist/style-scss.css',
                'dist/style-scss.scss'
            ]
        },
        express: {
            dev: {
                options: {
                    script: 'server.js',
                    spawn: false
                }
            }
        },
        sro_create_angular_components: {
            website: {
                views: [
                    "app/views/home",
                    "app/views/login",
                    "app/views/gallery",
                    "app/views/weddinglist",
                    "app/views/guestbook"
                ],
                directives: [
                    "app/components/sgwHeader",
                    "app/views/home/components/sgwInvitation"
                ]
            },
            options: {
                initServiceController: true,
                cssSuffix: "scss"
            }
        }
    });

    grunt.registerTask('default', [
        'clean:dist',
        'generateCSS',
        'generateJS'
    ]);

    grunt.registerTask("generateJS", [
        'ngtemplates',
        'concat:js-not-min',
        'ngAnnotate',
        'uglify:js',
        'concat:js-min',
        'clean:end-build'
    ]);

    grunt.registerTask("generateCSS", [
        'concat:sass',
        'concat:css',
        'sass',
        'concat:sass-css',
        'autoprefixer',
        'cssmin',
        'clean:assets',
        'clean:end-build'
    ]);

    grunt.registerTask('generate files', [
        'sro_create_angular_components'
    ]);

    grunt.registerTask('default + watch', [
        'default',
        'watch'
    ]);

    grunt.registerTask('default + express + watch', [
        'default',
        'express',
        'watch'
    ]);

};

