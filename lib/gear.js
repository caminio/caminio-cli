var util        = require('./util')
  , fs          = require('fs')
  , colors      = require('colors')
  , info        = require('./info')
  , common      = require('./common')
  , mkdirp      = require('mkdirp')
  , pkg         = require('../package')
  , nodeUtil    = require('util')
  , program     = require('commander')
  , join        = require('path').join;

module.exports = {
  create: createGear
}

function createGear( name ){

  info.generator = 'gear';

  var gear_opts = { api: program.api };

  if( !name || name.length < 1 )
    return console.log('    ','aborted'.red, 'reason:', 'no name given. Please provide a gear name');

  if( fs.existsSync(name) )
    return console.log('    ','aborted'.red, 'reason:', 'a directory with name',name,'already exists');

  console.log('    ','caminio'.bold,'generator','version',pkg.version,'\n');

  util.mkdir(name);

  if( gear_opts.api )
    common.createAPIDirs(name);

  createConfigDirs(name);

  util.copyFile( name, join('package.json'), [ 
    [new RegExp('APPNAME', 'g'), name] 
  ]);


  util.copyFile( name, join('index.js'), [
    ['GEAR_OPTS', nodeUtil.inspect(gear_opts)]
  ]);

  util.copyFile( name, join('README.md'), [ 
    [new RegExp('APPNAME', 'g'), name] 
  ]);

  util.copyFile( name, join('.gitignore'), [], 'common' );
  util.copyFile( name, join('Gruntfile.js') );

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
