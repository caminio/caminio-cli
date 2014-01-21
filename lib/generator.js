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
}

function controller( name ){

  if( !isCaminioDir() ) return console.log('    ','not a caminio directory'.red);

  name = name.indexOf('Controller') > 0 ? name : name+'Controller';

  replacements = [ 
    [ new RegExp('__NAME__','g'), inflection.classify(name) ] 
  ];

  var fileData = fs.readFileSync( join( __dirname, '..', 'templates', 'generator', 'controller_tmpl.js' ), 'utf8' );
  
  replacements.forEach( function( repl ){
    fileData = fileData.replace( repl[0], repl[1] );
  });

  var fileName = join( 'api', 'controllers', inflection.underscore(name) )+'.js';

  if( !fs.existsSync( dirname(fileName) ) )
    mkdirp( dirname(fileName) )

  fs.writeFileSync( fileName, fileData );
  console.log('    ','create'.green, fileName );
  
}

function model( name ){

  if( !isCaminioDir() ) return console.log('    ','not a caminio directory'.red);
  
  replacements = [ 
    [ new RegExp('__NAME__','g'), inflection.classify(name) ] 
  ];

  var fileData = fs.readFileSync( join( __dirname, '..', 'templates', 'generator', 'model_tmpl.js' ), 'utf8' );
  
  replacements.forEach( function( repl ){
    fileData = fileData.replace( repl[0], repl[1] );
  });

  var fileName = join( 'api', 'models', inflection.underscore(name) )+'.js';

  if( !fs.existsSync( dirname(fileName) ) )
    mkdirp( dirname(fileName) )

  fs.writeFileSync( fileName, fileData );
  console.log('    ','create'.green, fileName );

}

function isCaminioDir(){
  return fs.existsSync( process.cwd()+'/api' ) && fs.existsSync( process.cwd()+'/Gruntfile.js' );
}