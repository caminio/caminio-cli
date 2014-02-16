var fs = require('fs');

module.exports = function(grunt) {

  /*jshint scripturl:true*/

  var gearName = 'MODNAME';

  var requireConfig = {
    baseUrl: 'assets/javascripts/'+gearName+'/app/',
    paths: {
      'jquery': '../components/jquery/jquery.min',
      'knockout': '../components/knockout.js/knockout-2.3.0.debug',
      'knockout.validation': '../components/knockout.validation/Dist/knockout.validation',
      'text': '../components/requirejs-text/text',
      'durandal': '../components/durandal/js',
      'plugins': '../components/durandal/js/plugins',
      'transitions': '../components/durandal/js/transitions',
      'bootstrap': '../components/bootstrap/dist/js/bootstrap',
      'i18next': '../components/i18next/release/i18next.amd-1.7.1.min',
      'inflection': '../components/inflection/lib/inflection',
      'ace': '../components/ace/lib/ace/ace',
      //'select2': '../components/select2/select2',
      'moment': '../components/moment/moment',
      'caminio': '../components/caminio',
      'ds': '../components/caminio-ds',
      'models': 'models',
      'adapters': 'adapters',
      'almond': '../components/durandal-almond/almond'
    }
  };

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    gearName: gearName,

    clean: {
      build: ['build']
    },

    mochaTest: {
      test: {
        options: {
          globals: ['should'],
          timeout: 3000,
          bail: true,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        },
        src: ['test/**/*.test.js']
      }
    }, 

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        //version: '<%= pkg.version %>',
        //url: '<%= pkg.homepage %>',
        options: {
          exclude: 'test,node_modules,public/javascripts/vendor',
          paths:  '.',
          outdir: './doc'
        }
      }
    },

    durandal: {
      main: {
        src: [ 'assets/javascripts/<%= gearName %>/app/**/*.*', 
               'assets/javascripts/<%= gearName %>/components/durandal/**/*.js' ],
        options: {
          name: '../components/durandal-almond/almond',
          baseUrl: requireConfig.baseUrl,
          mainPath: 'assets/javascripts/<%= gearName %>/app/main',
          paths: requireConfig.paths,
          exclude: [],
          optimize: 'none',
          out: 'build/javascripts/'+gearName+'.js'
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
        src: 'build/javascripts/'+gearName+'.js',
        dest: 'build/javascripts/'+gearName+'.min.js'
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
      }
    },

    cssmin: {
      add_banner: {
        options: {
          banner: '/* camin.io */'
        },
      },
      combine: {
        files: {
          'build/stylesheets/<%= gearName %>.min.css': [ 'assets/stylesheets/<%= gearName %>-static/*.css', 
                                                    'assets/stylesheets/<%= gearName %>/*.css' ],
          'build/stylesheets/caminio-auth.min.css': [ 'assets/stylesheets/<%= gearName %>/authorization.css' ]
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'api/**/*.js', 'config/**/*.js', 'assets/javascripts/<%= gearName %>/app'],
      options: {
        "laxcomma": true
      }
    },

  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', 'runs all tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testUnit', 'runs only unit tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.unit.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testModels', 'runs only model tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*model.unit.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('testApi', 'runs only api tests', function(){
    grunt.task.run('clearLogs');
    grunt.config('mochaTest.test.src', ['test/**/*.api.*.test.js']);
    grunt.task.run('mochaTest');
  });

  grunt.registerTask('clearLogs', function(){
    if( fs.existsSync('test.log') )
      fs.unlinkSync('test.log');
  });

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'cssmin',
    'copy:img',
    'durandal',
    'uglify'
  ]);

  grunt.registerTask('docs', 'yuidoc');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-durandal');


  // Default task(s).
  grunt.registerTask('default', ['test']);

};
