'use strict';

var SentMessage = (function() {

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var errorHandler = require('./errors.server.model.js');

/**
 * SentMessage Schema
 */
var _sentmessagesSchema = new Schema({
	billingid: {
		type: Schema.Types.ObjectId,
		ref: 'billings'
	},
	message: {		
		type: String,
		default: '',		
		trim: true		
	},
	created: {
		type: Date,
		default: Date.now
	}
});

var _model = mongoose.model('sentmessages', _sentmessagesSchema);

// Get sentmessages
	var _getAll = function(callback, limit){
		_model.find({}, function(err, docs) {
			if(err)
				callback(errorHandler.getErrorMessage(err), null);
			else
				callback(null, docs);
		}).limit(limit).sort([['billingid', 'ascending']]);
	}

// Get sentmessages
	var _getByBillingId = function(billingid, callback){
		_model.find( { billingid: billingid }, function(err, docs) {
			if(err)
				callback(errorHandler.getErrorMessage(err), null);
			else
				callback(null, docs);
		});
	}

// Add sentmessage
	var _add = function(sentmessage, callback){
		var newSentMessage =  new _model();

		newSentMessage.billingid = sentmessage.billingid;
		newSentMessage.message = sentmessage.message;

		newSentMessage.save(function(err, doc) {
			if(err)
				callback(errorHandler.getErrorMessage(err),null);
			else
				callback(null, doc);
		});
	}

// Update SentMessage
	var _update = function(sentmessage, callback){
		var update = {
			billingid: sentmessage.billingid,
			message: sentmessage.message,
		}
		_model.findByIdAndUpdate(sentmessage._id, update, {new: true, upsert: true}, function(err, doc) {
			if(err)
				callback(errorHandler.getErrorMessage(err), null);
			else
				callback(null, doc);
		});
	}


// Remove SentMessage
	var _remove = function(sentmessageid, callback){
		var query = {_id: sentmessageid};
		_model.remove(query, function(err) {
			if(err)
				callback(errorHandler.getErrorMessage(err), null);
			else
				callback(null, sentmessageid);
		});
	}

	return {
		model: _model,
		schema: _sentmessagesSchema,
		add: _add,
		update: _update,
		getByBillingId: _getByBillingId,
		getAll: _getAll,
		remove: _remove,
	}

})();

module.exports = SentMessage;
