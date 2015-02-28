'use strict'

module.exports = function(grunt) {

    //Initialize grunt configuration
    grunt.initConfig({

        //Basic grunt file read task
        pkg: grunt.file.readJSON('package.json'),

        nodemon: {
            dev: {
                script: 'server.js'
            }
        }
    });
    //Load library or use nodemon
    grunt.loadNpmTasks('grunt-nodemon');

    //Configure & Run the default task
    grunt.registerTask('default', ['nodemon']);

}
