var util        = require('./util');
var fs          = require('fs');
var colors      = require('colors');
var info        = require('./info');
var common      = require('./common');
var mkdirp      = require('mkdirp');
var pkg         = require('../package');
var nodeUtil    = require('util');
var program     = require('commander');
var join        = require('path').join;

module.exports = {
  create: createGear
};

function createGear( name ){

  info.generator = 'gear';

  var gear_opts = { api: program.api };

  if( !name || name.length < 1 )
    return console.log('    ','aborted'.red, 'reason:', 'no name given. Please provide a gear name');

  if( fs.existsSync(name) )
    return console.log('    ','aborted'.red, 'reason:', 'a directory with name',name,'already exists');

  console.log('    ','caminio'.bold,'generator','version',pkg.version,'\n');

  util.mkdir('caminio-'+name);

  if( gear_opts.api )
    common.createAPIDirs('caminio-'+name);

  createConfigDirs('caminio-'+name);

  util.copyFile( 'caminio-'+name, join('package.json'), [ 
    [new RegExp('APPNAME', 'g'), 'caminio-'+name] 
  ]);


  util.copyFile( 'caminio-'+name, join('index.js'), [
    ['GEAR_OPTS', nodeUtil.inspect(gear_opts)]
  ]);

  util.copyFile( 'caminio-'+name, join('README.md'), [ 
    [new RegExp('APPNAME', 'g'), name] 
  ]);

  //util.copyFile( 'caminio-'+name, join('.gitignore'), [], 'common' );
  util.copyFile( 'caminio-'+name, join('Gruntfile.js'), [[new RegExp('MODNAME', 'g'), 'caminio-'+name]] );

  console.log('');
}

function createConfigDirs( name ){

  console.log('');
  util.mkdir( join(name,'config') );

  util.copyFile( name, join('config','routes.js'), [], 'common' );

  util.mkdir( join(name,'config','i18n') );
  util.copyFile( name, join('config','i18n','en.js'), [], 'common' );
  util.copyFile( name, join('config','i18n','de.js'), [], 'common' );

}
