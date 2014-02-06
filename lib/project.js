var util        = require('./util');
var fs          = require('fs');
var colors      = require('colors');
var common      = require('./common');
var mkdirp      = require('mkdirp');
var pkg         = require('../package');
var info        = require('./info');
var join        = require('path').join;

module.exports = {
  create: createProject
};

function createProject( name ){

  info.generator = 'project';

  if( !name || name.length < 1 )
    return console.log('    ','aborted'.red, 'reason:', 'no name given. Please provide a gear name');

  if( fs.existsSync(name) )
    return console.log('    ','aborted'.red, 'reason:', 'a directory with name',name,'already exists');

  console.log('    ','caminio'.bold,'generator','version',pkg.version,'\n');

  util.mkdir(name);

  common.createAPIDirs(name);
  createConfigDirs(name);

  util.copyFile( name, join('package.json'), [ 
    [new RegExp('APPNAME', 'g'), name] 
  ]);

  util.copyFile( name, join('index.js') );

  util.copyFile( name, join('README.md'), [ 
    [new RegExp('APPNAME', 'g'), name] 
  ]);

  //util.copyFile( name, join('.gitignore'), [], 'common' );

  util.copyFile( name, join('Gruntfile.js') );

  console.log('');
}


function createConfigDirs( name ){

  console.log('');
  
  util.mkdir( join(name,'config') );

  util.copyFile( name, join('config','token.js') );
  util.copyFile( name, join('config','view_engines.js') );
  util.copyFile( name, join('config','session.js'), [ [new RegExp('SECRET', 'g'), util.uid(64)] ] );

  util.copyFile( name, join('config','routes.js'), [], 'common' );

  util.mkdir( join(name,'config','i18n') );
  util.copyFile( name, join('config','i18n','en.js'), [], 'common' );
  util.copyFile( name, join('config','i18n','de.js'), [], 'common' );

  util.mkdir( join(name,'config','environments') );
  util.copyFile( name, join('config','environments','production.js'), [ [new RegExp('DBNAME', 'g'), name ] ] );
  util.copyFile( name, join('config','environments','development.js'), [ [new RegExp('DBNAME', 'g'), name+'-dev' ] ] );

  util.mkdir( join(name,'config','errors') );
  util.copyFile( name, join('config','errors','404.js') );
}