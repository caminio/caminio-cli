/**
 *
 * @class __NAME__
 *
 */
 
module.exports = function __NAME__( caminio, mongoose ){

  var ObjectId = mongoose.Schema.Types.ObjectId;

  var schema = new mongoose.Schema({

    /**
     * @property name
     * @type String
     */  
    name: String,

    /**
     * @property created.at
     * @type Date
     */

    /**
     * @property created.by
     * @type ObjectId
     */
    created: { 
      at: { type: Date, default: Date.now },
      by: { type: ObjectId, ref: 'User' }
    },

    /**
     * @property updated.at
     * @type Date
     */

    /**
     * @property updated.by
     * @type ObjectId
     */
    updated: { 
      at: { type: Date, default: Date.now },
      by: { type: ObjectId, ref: 'User' }
    }

  });

  // these attributes will be
  // visible in toJSON and toObject calls
  schema.publicAttributes = ['name','updated','created'];

  return schema;

}