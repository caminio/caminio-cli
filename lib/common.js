var util        = require('./util');
var info        = require('./info');
var join        = require('path').join;

module.exports = {
  createAPIDirs: createAPIDirs
};

function createAPIDirs( name ){

  util.mkdir( join(name,'api') );
  util.mkdir( join(name,'api','models'), true );
  util.mkdir( join(name,'api','controllers'), true );
  util.mkdir( join(name,'api','views'), true );
  util.mkdir( join(name,'api','assets'), true );

  console.log('');

  util.mkdir( join(name,'assets','javascripts'), true );
  util.mkdir( join(name,'assets','stylesheets'), true );
  util.mkdir( join(name,'assets','images'), true );

  if( info.generator !== 'project' ) return;
  
  util.copyFile( name, join('api','views','404.html.jade') );

  util.mkdir( join(name,'api','views','main'), true );
  util.copyFile( name, join('api','views','main','index.html.jade') );
  util.mkdir( join(name,'api','views','layouts'), true );
  util.copyFile( name, join('api','views','layouts','application.jade'), [[new RegExp('APPNAME', 'g'), name]]  );
  util.copyFile( name, join('api','controllers','main_controller.js') );

  util.mkdir( join(name,'assets','images'), true );
  util.copyBinary( name, join('assets','images','logo_100x100.png') );

}
