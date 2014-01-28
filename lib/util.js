var fs          = require('fs');
var join        = require('path').join;
var colors      = require('colors');
var mkdirp      = require('mkdirp');
var info        = require('./info');

module.exports = {
  copyFile: copyFile,
  copyBinary: copyBinary,
  mkdir: mkdir,
  uid: uid
};

function copyFile( name, dir, replacements, genPath ){

  genPath = genPath || info.generator;

  replacements = replacements || [];

  var fileData = fs.readFileSync( join( __dirname, '..', 'templates', genPath, dir ), 'utf8' );
  
  replacements.forEach( function( repl ){
    fileData = fileData.replace( repl[0], repl[1] );
  });

  fs.writeFileSync( join( name, dir ), fileData );

}

function copyBinary( name, dir, genPath ){

  genPath = genPath || info.generator;
  var inStr = fs.createReadStream( join( __dirname, '..', 'templates', genPath, dir) );
  var outStr = fs.createWriteStream( join( name, dir ) );
  inStr.pipe(outStr);

}

function mkdir( dir, gitkeep ){
  console.log('    ','create'.green, dir);
  mkdirp.sync(dir);
  if( gitkeep )
    fs.openSync( join(dir,'.gitkeep'), 'w' );
}

function uid(len){
  var buf = [];
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charlen = chars.length;

  for (var i = 0; i < len; ++i)
    buf.push(chars[getRandomInt(0, charlen - 1)]);

  return buf.join('');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
