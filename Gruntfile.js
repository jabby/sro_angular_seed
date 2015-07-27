module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('assemble-less');


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
                    'assets/**/*.css'
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
        less: {
            components: {
                files: [
                    {expand: true, cwd: '', src: 'app/**/*.less', dest: 'assets/', ext: '.css'}
                ]
            }
        },
        watch: {
            html: {
                files: ['app/**/*.html'],
                tasks: ['ngtemplates']
            },
            css: {
                files: ['app/**/*.css', 'app/**/*.less'],
                tasks: ['generateCSS', 'clean:end-build']
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
            bowerFiles: {
                src: [
                    'tmp/components/**/*.min.js',
                    'tmp/components/angular-i18n/angular-locale_fr-fr.js'
                ],
                dest: 'app/vendors/js/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
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
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        clean: {
            tmp: ["tmp/"],
            assets: ["assets/"],
            dist: ["dist/"],
            "end-build": ['dist/style.css', 'dist/script.js']
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
                cssSuffix: "less"
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
        'less',
        'copy:cssVendorFiles',
        'concat:css',
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

    grunt.registerTask('bower-task', [
        "bower",
        "copy:bowerFiles"
    ]);
    //"clean:tmp"
};

