#!/usr/bin/env node

var program     = require('commander')
  , colors      = require('colors')
  , fs          = require('fs')
  , join        = require('path').join
  , mkdirp      = require('mkdirp')
  , pkg         = require('./package')

program
  .version(pkg.version)

program
  .option('new [name]', 'Create a new caminio project' )
  .on('new', function( name ){

    if( !name || name.length < 1 )
      return console.log('    ','aborted'.red, 'reason:', 'no name given. Please provide a project name');

    if( fs.existsSync(name) )
      return console.log('    ','aborted'.red, 'reason:', 'a directory with name',name,'already exists');

    console.log('    ','caminio'.bold,'generator','version',pkg.version,'\n');

    console.log('    ','create'.green, name);
    mkdirp.sync(name);

    createAPIDirs(name);
    createConfigDirs(name);

    copyFile( name, join('package.json'), [ 
      [new RegExp('APPNAME', 'g'), name] 
    ]);

    copyFile( name, join('index.js') );

    copyFile( name, join('README.md'), [ 
      [new RegExp('APPNAME', 'g'), name] 
    ]);

    copyFile( name, join('.gitignore') );
    copyFile( name, join('Gruntfile.js') );

  });


program.parse(process.argv);


function createAPIDirs( name ){

  mkdir( join(name,'api') );
  mkdir( join(name,'api','models'), true );
  mkdir( join(name,'api','controllers'), true );
  mkdir( join(name,'api','views'), true );

  copyFile( name, join('api','views','404.ejs') );

}

function createConfigDirs( name ){

  console.log('\n');
  mkdir( join(name,'config') );

  copyFile( name, join('config','routes.js') );
  copyFile( name, join('config','adapters.js') );
  copyFile( name, join('config','token.js') );
  copyFile( name, join('config','session.js'), [ [new RegExp('SECRET', 'g'), uid(64)] ] );

  mkdir( join(name,'config','i18n') );
  copyFile( name, join('config','i18n','en.js') );
  copyFile( name, join('config','i18n','de.js') );

  mkdir( join(name,'config','environments') );
  copyFile( name, join('config','environments','production.js'), [ [new RegExp('DBNAME', 'g'), name ] ] );
  copyFile( name, join('config','environments','development.js'), [ [new RegExp('DBNAME', 'g'), name+'-dev' ] ] );

  mkdir( join(name,'config','errors') );
  copyFile( name, join('config','errors','404.js') );
}

function copyFile( name, dir, replacements ){

  replacements = replacements || [];

  var fileData = fs.readFileSync( join( __dirname, 'template', dir ), 'utf8' );
  
  replacements.forEach( function( repl ){
    fileData = fileData.replace( repl[0], repl[1] );
  });

  fs.writeFileSync( join( name, dir ), fileData );

}

function mkdir( dir, gitkeep ){
  console.log('    ','create'.green, dir);
  mkdirp.sync(dir);
  if( gitkeep )
    fs.openSync( join(dir,'.gitkeep'), 'w' );
}

function uid(len){
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i)
    buf.push(chars[getRandomInt(0, charlen - 1)]);

  return buf.join('');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
