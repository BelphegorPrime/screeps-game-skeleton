let screepsJson = require('./config/screeps.json');
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-screeps');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        screeps: {
            options: {
                email: screepsJson.email,
                password: screepsJson.password,
                branch: screepsJson.branch,
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}