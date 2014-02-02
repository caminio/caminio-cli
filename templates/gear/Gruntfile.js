var _         = require('lodash');
var async     = require('async');

// the whole setup is inspired by:
// https://github.com/RainerAtSpirit/HTMLStarterKitPro/blob/master/Gruntfile.js
//
module.exports = function(grunt) {

  /*jshint scripturl:true*/

  var requireConfig = {
    baseUrl: 'assets/javascripts/MODNAME/app/',
    paths: {
      'jquery': '../components/jquery/jquery.min',
      'knockout': '../components/knockout.js/knockout-2.3.0.debug',
      'text': '../components/requirejs-text/text',
      'durandal': '../components/durandal/js',
      'plugins': '../components/durandal/js/plugins',
      'transitions': '../components/durandal/js/transitions',
      'bootstrap': '../components/bootstrap/dist/js',
      'i18next': '../components/i18next/release/i18next.amd-1.7.1.min',
      'inflection': '../components/inflection/lib/inflection',
      //'select2': '../components/select2/select2',
      'moment': '../components/moment/moment',
      'caminio': '../../caminio',
      'ds': '../../caminio-ds',
      'models': 'models',
      'adapters': 'adapters',
      'almond': '../components/durandal-almond/almond'
    }
  };

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build']
    },

    cssmin: {
      add_banner: {
        options: {
          banner: '/* camin.io */'
        },
      },
      combine: {
        files: {
          'build/stylesheets/MODNAME.min.css': [ 'assets/stylesheets/MODNAME-static/*.css', 
                                                  'assets/stylesheets/MODNAME/*.css' ]
        }
      }
    },
    
    durandal: {
      main: {
        src: [ 'assets/javascripts/MODNAME/app/**/*.*', 
               'assets/javascripts/MODNAME/components/durandal/**/*.js' ],
        options: {
          name: '../components/durandal-almond/almond',
          baseUrl: requireConfig.baseUrl,
          mainPath: 'assets/javascripts/MODNAME/app/main',
          paths: requireConfig.paths,
          exclude: [],
          optimize: 'none',
          out: 'build/javascripts/MODNAME/app/main.js'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> TASTENWERK \n' +
            '* Available via the MIT license.\n' +
            '* see: http://opensource.org/licenses/MIT for blueprint.\n' +
            '*/\n'
      },
      build: {
        src: 'build/javascripts/MODNAME/app/main.js',
        dest: 'build/javascripts/MODNAME/app/main.min.js'
      }
    },

    copy: {
      img: {
        files: [
          { 
            expand: true,
            cwd: 'assets/images',
            src: ['**/*'], 
            dest: 'build/images/'
          }
        ]
      },
      fonts: {
        files: [
          { 
            expand: true,
            cwd: 'assets/fonts/',
            src: ['**/*'], 
            dest: 'build/fonts/'
          }
        ]
      }
    },

    mocha_phantomjs: {
      all: ['test/browser/unit/**/*.html']
    },

    jshint: {
      all: ['Gruntfile.js', 'api/**/*.js', 'config/**/*.js', 'assets/javascripts/MODNAME/app'],
      options: {
        "laxcomma": true
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-durandal');

  // tests
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'cssmin',
    'copy:img',
    'copy:fonts',
    'durandal',
    'uglify'
  ]);

  grunt.registerTask('startServer', function(){
    process.env.NODE_ENV = 'test';
    
    var done = this.async();    
    
    var caminio = require('caminio');
    var Gear = require('caminio/gear');
    require('caminio-auth'); // require this gear
    require('./'); // require this gear
    new Gear({ api: true, absolutePath: __dirname+'/test/support/app' });

    caminio.init({ 
      config: { 
        root: __dirname+'/test/support/app',
        log: {
          filename: process.cwd()+'/test.log'
        }
      }
    });

    // clean up database;
    caminio.on('ready', function(){
      async.each( Object.keys(caminio.models), function(modelName, next){
        caminio.models[modelName].remove({}, function(err){
          if( err ) console.log(err);
          next();
        });
      }, done );
    });

  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('test', [
    'jshint',
    'startServer',
    'mocha_phantomjs'
    ]);

};