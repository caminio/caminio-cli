var fs        = require('fs')
  , join      = require('path').join
  , async     = require('async');

module.exports = function(grunt) {

  var pkgFile = grunt.file.readJSON('package.json')
    , regGears = []
    , watchWatch = []
    , nodemonWatch = ['api/'];

  // fetch any asset directories from
  // included gears in the package.json file
  Object.keys(pkgFile.dependencies).forEach( function(depName){
    if( depName.match(/^caminio-/) ){
      nodemonWatch.push('node_modules/'+depName+'/api');
      nodemonWatch.push('node_modules/'+depName+'/config');
      regGears.push( depName );
      if( fs.existsSync( 'node_modules/'+depName+'/assets' ) ){
        //watchWatch.push( 'node_modules/'+depName+'/assets/stylesheets/**/*.css' );
        watchWatch.push( 'node_modules/'+depName+'/assets/javascripts/'+depName+'/**/*.js' );
        watchWatch.push( 'node_modules/'+depName+'/config/**/*.js' );
        watchWatch.push( 'node_modules/'+depName+'/api/**/*.js' );
      }
    }
  });

  // Project configuration.
  grunt.initConfig({

    pkg: pkgFile,

    watch: {
      files: watchWatch,
      // run the following task on change
      tasks: [ 'gears:jshint' ],
      options: {
        interrupt: true,
        spawn: false
      }
    },

    clean: {
      build: ['public']
    },

    nodemon: {
      dev: {
        script: 'index.js',
        options: {
          watch: nodemonWatch,
          nodeArgs: [ '--debug' ],
          env: {
            PORT: '4000'
          }
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    copy: {
      staticJS: {
        files: [
          { 
            expand: true,
            cwd: 'assets/javascripts',
            src: ['**/*.js'], 
            dest: 'public/javascripts/'
          }
        ]
      },
      gear: {
        files: [
          {
            expand: true,
            cwd: 'log',
            src: ['**/*'],
            dest: 'public'
          }
        ]
      }
    },

    gears: {
      jshint: 1,
      build: 1,
      copy: 1
    }

  });

  grunt.registerMultiTask('gears', 'itereate through node_modules/caminio-* gears and perform task', function(){

    var task = this;
    // copy task
    if( task.target === 'copy' ){
      var copyDirs = [];
      regGears.forEach( function(mod){

        if( !grunt.file.exists( join('node_modules',mod,'assets') ) )
          return;
        copyDirs.push({
          expand: true,
          cwd: join('node_modules/',mod,'/build/'),
          src: ['**/*'],
          dest: 'public'
        })
      });

      grunt.config('copy.gear.files', copyDirs);
      grunt.task.run('copy:gear');

      return;
    }

    var done = task.async();
    async.each(regGears, function( mod, next ){

      if( !grunt.file.exists( join('node_modules',mod,'assets') ) )
        return next();

      grunt.util.spawn({
        grunt: true,
        args: [ task.target ],
        cmd: 'grunt',
        opts: {
            cwd: 'node_modules/'+mod
        }
      }, function (err, result, code) {

        if( err ){ 
          grunt.log.error(result);
          grunt.log.error(err); 
        }
        else
          grunt.log.ok(mod);
        next();
      });

    }, function(){
      console.log('ready');
      done();
    });

  });

  grunt.registerTask('server', function(){
    if( process.env.NODE_ENV === 'production' )
      return grunt.task.run('nodemon');
    grunt.task.run('concurrent');
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean','copy:staticJS','gears:build','gears:copy']);
  
  grunt.registerTask('default', ['server']);

};
