/**
 * Created by bbedsaul on 8/1/16.
 */
'use strict';

module.exports = function(grunt) {

  require('logfile-grunt')(grunt);

  // Unified Watch Object
  var watchFiles = {
    serverJS: ['gruntfile.js', 'src/server.js', 'src/**/*.js'],
    mochaTests: ['src/tests/**/**.server.model.test.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          nospawn: true,
        },
      }
    },
    jshint: {
      all: {
        src: watchFiles.serverJS,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'src/server.js',
        options: {
          nodeArgs: ['--debug'],
          nospawn: true,
          ext: 'js,html',
          watch: watchFiles.serverJS
        }
      }
    },
    concurrent: {
      default: ['nodemon'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: false
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      secure: {
        NODE_ENV: 'secure'
      }
    },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'src/server.js'
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    var init = require('./src/config/init')();
    var config = require('./src/config/config');

  });

  // Default task(s).
  grunt.registerTask('default', ['nodemon']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Secure task(s).
  grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint']);

  // Build task(s).
  grunt.registerTask('build', ['lint', 'loadConfig']);

  // Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);
};