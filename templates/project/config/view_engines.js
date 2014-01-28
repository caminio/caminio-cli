module.exports.viewEngines = {
  
  'jade': {
    ext: [ 'jade' ],
    engine: require('jade').__express,
    default: 'jade'
  }

};