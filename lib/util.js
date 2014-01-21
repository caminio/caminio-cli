var fs          = require('fs')
  , join        = require('path').join
  , colors      = require('colors')
  , mkdirp      = require('mkdirp')
  , info        = require('./info');

module.exports = {
  copyFile: copyFile,
  mkdir: mkdir,
  uid: uid
}

function copyFile( name, dir, replacements, genPath ){

  genPath = genPath || info.generator;

  replacements = replacements || [];

  var fileData = fs.readFileSync( join( __dirname, '..', 'templates', genPath, dir ), 'utf8' );
  
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
