var fs        = require('fs')
  , join      = require('path').join;

module.exports = function(grunt) {

  var pkgFile = grunt.file.readJSON('package.json')
    , regGears = []
    , watchFiles = []
    , watchDirs = ['api/'];

  // fetch any asset directories from
  // included gears in the package.json file
  Object.keys(pkgFile.dependencies).forEach( function(depName){
    if( depName.match(/^caminio-/) ){
      watchDirs.push('node_modules/'+depName+'/api');
      regGears.push( depName );
      if( fs.existsSync( 'node_modules/'+depName+'/assets/stylesheets' ) )
        watchFiles.push( 'node_modules/'+depName+'/assets/stylesheets/**/*.less' );
    }
  });

  // Project configuration.
  grunt.initConfig({

    pkg: pkgFile,

    watch: {
      files: watchFiles,
      tasks: [ 'gears' ],
      options: {
        interrupt: true,
        spawn: false
      }
    },

    copy: {
      main: {
        src: 'assets/stylesheets/*',
        dest: 'public/stylesheets/',
        flatten: true,
        expand: true
      },
      img: {
        nonull: true,
        flatten: true,
        expand: true
      },
      fonts: {
        nonull: true,
        flatten: true,
        expand: true
      }
    },

    bower: {
      target: {
        rjsConfig: 'assets/javascripts/config.js',
        options: {
          baseUrl: './'
        }
      }
    },

    clean: {
      build: ['public']
    },

    requirejs: {
      compile: {
        options: {
          name: "config",
          baseUrl: "assets/javascripts",
          mainConfigFile: "assets/javascripts/config.js",
          //out: "public/javascripts/caminio-ui/config.js",
          fileExclusionRegExp: /^\.|node_modules|Gruntfile|\.md|package.json|bower.json|component.json|composer.json/,
          dir: 'public/javascripts/caminio-ui/',
          optimize: 'none'
        }
      }
    },

    //cssmin: {
    //  minify: {
    //    expand: true,
    //    cwd: 'release/css/',
    //    src: ['*.css', '!*.min.css'],
    //    dest: 'public/stylesheets/'
    //  }
    //},

    less: {
      development: {
        files: {
          "public/stylesheets/application.css": "assets/stylesheets/application.less"
        }
      }
    },

    express: {
      options: {
        background: true
      },
      dev: {
        options: {
          script: 'index.js'
        }
      }
    },

    nodemon: {
      dev: {
        script: 'index.js',
        options: {
          watch: watchDirs,
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
    }

  });

  grunt.registerTask('gears', function(){
   
    regGears.forEach( function( mod ){

      var pubImg = 'public/images/'+mod
        , pubCss = 'public/stylesheets/'+mod
        , pubFonts = 'public/fonts/'+mod
        , pubJs  = 'public/javascripts/'+mod;

      var cssDir = join('node_modules',mod,'assets','stylesheets')
        , imgDir = join('node_modules',mod,'assets','images')
        , fontsDir = join('node_modules',mod,'assets','fonts')
        , jsDir = join('node_modules',mod,'assets','javascripts');

      if( fs.existsSync(imgDir) ){
        grunt.config( 'copy.img.src', imgDir+'/**' );
        grunt.config( 'copy.img.dest', pubImg );
        grunt.task.run('copy:img');
      }
     
      if( fs.existsSync(fontsDir) ){
        grunt.config( 'copy.fonts.src', fontsDir+'/**' );
        grunt.config( 'copy.fonts.dest', pubFonts );
        grunt.task.run('copy:fonts');
      }

      if( fs.existsSync(jsDir) ){
        grunt.config( 'bower.target.rjsConfig', join(jsDir,'config.js') );
        grunt.task.run('bower');
        
        grunt.config( 'requirejs.compile.options.baseUrl', jsDir );
        grunt.config( 'requirejs.compile.options.mainConfigFile', join(jsDir,'config.js') );
        grunt.config( 'requirejs.compile.options.dir', pubJs );
        grunt.config( 'requirejs.compile.options.optimize', 'none' );
        grunt.task.run('requirejs');

        grunt.config( 'copy.main.src', join(jsDir,'direct')+'/**' )
        grunt.config( 'copy.main.dest', join( pubJs, 'direct')+'/' );
        grunt.task.run('copy');
      }

      //grunt.config( 'cssmin.minify.cwd', join('node_modules',mod,'assets','stylesheets') );
      //grunt.config( 'cssmin.minify.dest', join('public','stylesheets',mod)+'/' );
      //grunt.task.run('cssmin');

      if( fs.existsSync(cssDir) ){
        var lessFiles = {};
        lessFiles['public/stylesheets/'+mod+'.css'] = join(cssDir,'main.less');
        grunt.config('less.development.files', lessFiles );
        grunt.task.run('less');

        grunt.config( 'copy.main.src', join(cssDir,'components')+'/**' )
        grunt.config( 'copy.main.dest', join( pubCss, 'components')+'/' );
        grunt.task.run('copy');
      }

    });

  });

  grunt.registerTask('server', ['concurrent']);

  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-bower-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('build', ['clean','gears']);
  
  grunt.registerTask('default', ['server']);

};
