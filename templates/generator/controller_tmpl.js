/**
 * @class __NAME__
 */
module.exports = function __NAME__( caminio, policies, middleware ){

  return {

    _before: {
      // e.g.: '*': policies.ensureLogin,
    },

    /**
     * @method index
     */
    'index': [
      function( req, res ){
        res.send( req.text );
      }
    ],

  }

}