/**
 * @class MainController
 */
module.exports = function MainController( caminio, policies, middleware ){

  return {

    _before: {
      // set up your before filters here
      // typical before filters are policies.ensureLogin or 
      // policies.requireAdmin
      //
      // e.g.: '*': policies.ensureLogin,
      //       'index,show': [ policies.requireAdmin, myCustomCheck ]
      //
    },

    /**
     * @method index
     */
    'index': [
      function( req, res ){
        // this tries to find a template file in any of api/views directory
        // named [controller_namespace]/<controller_name>/<action_name>
        // here this would be main_controller/index
        res.caminio.render();
      }
    ]

  }

}