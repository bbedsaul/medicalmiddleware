'use strict';

var Message = (function() {

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var errorHandler = require('./errors.server.model.js');

/**
 * Message Schema
 */
var _messagesSchema = new Schema({
	clinicid: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: 'clinics'
	},
	message: {
		required: true,
		type: String,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

var _model = mongoose.model('messages', _messagesSchema);

// Get messages
  var _getAll = function(callback, limit){
    _model.find({}, function(err, docs) {
      if(err)
        callback(errorHandler.getErrorMessage(err), null);
      else
        callback(null, docs);
    }).limit(limit).sort([['clinicid', 'ascending']]);
  }

// Get messages
  var _getByClinicId = function(clinicid, callback){
    _model.find( { clinicid: clinicid }, function(err, docs) {
      if(err)
        callback(errorHandler.getErrorMessage(err), null);
      else
        callback(null, docs);
    });
  }

// Add message
  var _add = function(message, callback){
    var newMessage =  new _model();

    newMessage.clinicid = message.clinicid;
    newMessage.message = message.message;

    newMessage.save(function(err, doc) {
      if(err)
        callback(errorHandler.getErrorMessage(err),null);
      else
        callback(null, doc);
    });
  }

// Update Message
  var _update = function(message, callback){
    var update = {
      clinicid: message.clinicid,
      message: message.message,
    }
    _model.findByIdAndUpdate(message._id, update, {new: true, upsert: true}, function(err, doc) {
      if(err)
        callback(errorHandler.getErrorMessage(err), null);
      else
        callback(null, doc);
    });
  }


// Remove Message
  var _remove = function(messageid, callback){
    var query = {_id: messageid};
    _model.remove(query, function(err) {
      if(err)
        callback(errorHandler.getErrorMessage(err), null);
      else
        callback(null, messageid);
    });
  }

  return {
    model: _model,
    schema: _messagesSchema,
    add: _add,
    update: _update,
    getByClinicId: _getByClinicId,
    getAll: _getAll,
    remove: _remove,
  }

})();

module.exports = Message;
