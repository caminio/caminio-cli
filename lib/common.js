var util        = require('./util')
  , info        = require('./info')
  , join        = require('path').join;

module.exports = {
  createAPIDirs: createAPIDirs
}

function createAPIDirs( name ){

  util.mkdir( join(name,'api') );
  util.mkdir( join(name,'api','models'), true );
  util.mkdir( join(name,'api','controllers'), true );
  util.mkdir( join(name,'api','views'), true );

  if( info.generator !== 'project' ) return;
  
  util.copyFile( name, join('api','views','404.ejs') );

}
