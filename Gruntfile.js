'use strict';

var ngrok = require('ngrok');
var nodeStatic = require('node-static');

module.exports = function (grunt) {

    // Load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Grunt configuration
    grunt.initConfig({
        uglify: {
            build: {
                files: {
                    'optimized/js/perfmatters.js': ['js/perfmatters.js'],
                    'optimized/js/async-style.js': ['js/async-style.js'],
                    'optimized/views/js/main.js': ['views/js/main.js']
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    'optimized/css/print.css': ['css/print.css'],
                    'optimized/css/style.css': ['css/style.css'],
                    'optimized/views/css/bootstrap-grid.css': ['views/css/bootstrap-grid.css'],
                    'optimized/views/css/style.css': ['views/css/style.css']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'optimized/index.html': 'index.html',
                    'optimized/project-2048.html': 'project-2048.html',

                    'optimized/project-mobile.html': 'project-mobile.html',
                    'optimized/project-webperf.html': 'project-webperf.html',
                    'optimized/views/pizza.html': 'views/pizza.html'
                }
            }
        },
        imagemin: {
            static: {
                files: {
                    'optimized/img/2048.png': 'img/2048.png',
                    'optimized/img/cam_be_like.png': 'img/cam_be_like.png',
                    'optimized/img/mobilewebdev.png': 'img/mobilewebdev.png',
                    'optimized/img/profilepic.png': 'img/profilepic.png',
                    'optimized/views/images/pizza.png': 'views/images/pizza.png',
                    'optimized/views/images/pizzeria.png': 'views/images/pizzeria.png',
                    'optimized/views/images/pizzeria-small.png': 'views/images/pizzeria-small.png'
                }
            }
        },
        pagespeed: {
            options: {
                nokey: true,
                locale: "en_US",
                threshold: 40
            },
            local: {
                options: {
                    strategy: "desktop"
                }
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            }
        }
    });

    // Register customer task for ngrok
    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function () {
        var done = this.async();
        var port = 9292;

        // runs a http-server before calling ngrok and pagespeed
        var file = new nodeStatic.Server('./optimized', {cache: 864000, gzip: true});
        require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                file.serve(request, response);
            }).resume();
        }).listen(port);

        ngrok.connect(port, function (err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });

    // Register default tasks
    grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin', 'imagemin', 'psi-ngrok']);
};