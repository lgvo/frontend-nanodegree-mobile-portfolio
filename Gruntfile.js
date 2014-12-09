'use strict'

var ngrok = require('ngrok');
var nodeStatic = require('node-static')

module.exports = function(grunt) {

    // Load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Grunt configuration
    grunt.initConfig({
        uglify: {
            build: {
                files: {
                    'js/perfmatters.min.js': ['js/perfmatters.js'],
                    'js/async-style.min.js': ['js/async-style.js'],
                    'views/js/main.min.js': ['views/js/main.js']
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    'css/print.min.css': ['css/print.css'],
                    'css/style.min.css': ['css/style.css'],
                    'views/css/bootstrap-grid.min.css': ['views/css/bootstrap-grid.css'],
                    'views/css/style.min.css': ['views/css/style.css']
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
    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 9292;

        // runs a http-server before calling ngrok and pagespeed
        var file = new nodeStatic.Server('./', {cache: 864000, gzip: true});
        require('http').createServer(function(request, response){
            request.addListener('end', function(){
                file.serve(request, response);
            }).resume();
        }).listen(port);

        ngrok.connect(port, function(err, url) {
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
    grunt.registerTask('default', ['uglify', 'cssmin', 'psi-ngrok']);
}