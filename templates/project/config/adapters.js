module.exports.adapters = {
  
  'default':        'mongo',

  disk: {

    module:   'sails-disk'

  },

  mongo: {
    module   : 'sails-mongo',
    host     : 'localhost',
    port     : 27017,
    database : 'caminio-rev',
  }

}