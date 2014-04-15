var util        = require('./util')
  , fs          = require('fs')
  , colors      = require('colors')
  , mkdirp      = require('mkdirp')
  , info        = require('./info')
  , common      = require('./common')
  , inflection  = require('inflection')
  , dirname     = require('path').dirname
  , join        = require('path').join;

module.exports = {
  controller: controller,
  model: model
};

function controller( name ){

  if( !isCaminioDir() ) return console.log('    ','not a caminio directory'.red);

  name = name.indexOf('Controller') > 0 ? name : name+'Controller';

  var fileData = fs.readFileSync( join( __dirname, '..', 'templates', 'generator', 'controller_tmpl.js' ), 'utf8' );

  var fileName = join( 'api', 'controllers', inflection.underscore(name) )+'.js';
  
  var replacements = [ 
    [ new RegExp('__NAME__','g'), inflection.classify(name) ],
    [ new RegExp('__name__','g'), inflection.underscore(name) ], 
    [ new RegExp('__FILE_LOCATION__','g'), fileName ] 
  ];

  replacements.forEach( function( repl ){
    fileData = fileData.replace( repl[0], repl[1] );
  });

  if( !fs.existsSync( dirname(fileName) ) )
    mkdirp( dirname(fileName) );

  if( !fs.existsSync( fileName ) ){
    fs.writeFileSync( fileName, fileData );
    console.log('    ','create'.green, fileName );
  } else
    console.log('    ','skip'.bold, fileName );

  var viewName = join( 'api', 'views', inflection.underscore(name).replace('_controller','') )+'/index.html.jade';
  var replacements = [ 
    [ new RegExp('__NAME__','g'), inflection.classify(name).replace('Controller','') ],
    [ new RegExp('__name__','g'), inflection.underscore(name) ], 
    [ new RegExp('__FILE_LOCATION__','g'), viewName ] 
  ];

  if( !fs.existsSync( dirname(viewName) ) )
    mkdirp( dirname(viewName) );

  fileData = fs.readFileSync( join( __dirname, '..', 'templates', 'generator', 'index.html.jade' ), 'utf8' );  
  replacements.forEach( function( repl ){
    fileData = fileData.replace( repl[0], repl[1] );
  });

  if( !fs.existsSync( viewName ) ){  
    fs.writeFileSync( viewName, fileData );
    console.log('    ','create'.green, viewName );
  } else
    console.log('    ','skip'.bold, viewName );

  console.log('\n     suggested entry in','config/routes.js'.bold,':');
  console.log("       'autorest /caminio/"+inflection.underscore(name).replace('_controller','')+"': '"+inflection.transform(['classify','singularize'],name).replace('Controller','')+"'\n");
}

function model( name ){

  if( !isCaminioDir() ) return console.log('    ','not a caminio directory'.red);
  
  var replacements = [ 
    [ new RegExp('__NAME__','g'), inflection.classify(name) ] 
  ];

  var fileData = fs.readFileSync( join( __dirname, '..', 'templates', 'generator', 'model_tmpl.js' ), 'utf8' );
  
  replacements.forEach( function( repl ){
    fileData = fileData.replace( repl[0], repl[1] );
  });

  var fileName = join( 'api', 'models', inflection.underscore(name) )+'.js';

  if( !fs.existsSync( dirname(fileName) ) )
    mkdirp( dirname(fileName) );

  fs.writeFileSync( fileName, fileData );
  console.log('    ','create'.green, fileName );

}

function isCaminioDir(){
  return fs.existsSync( process.cwd()+'/api' ) && fs.existsSync( process.cwd()+'/Gruntfile.js' );
}
