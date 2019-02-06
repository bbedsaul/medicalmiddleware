'use strict';

var Delivery = (function() {

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var errorHandler = require('./errors.server.model.js');

/**
 * Delivery Schema
 */
var _deliverySchema = new Schema({
	deliveryid: {
		type: String,
    unique: true,
		required: true
	},
	deliverytype: {
		required: true,
		type: String,
		default: '',		
		trim: true		
	},
	directory: {		
		type: String,
		default: '',		
		trim: true		
	},
	
	created: {
		type: Date,
		default: Date.now
	}
});

var _model = mongoose.model('deliveries', _deliverySchema);

// Get Deliveries
var _getAll = function(callback, limit){
	_model.find({}, function(err, docs) {
		if(err)
			callback(errorHandler.getErrorMessage(err), null);
    else
    	callback(null, docs);
	}).limit(limit).sort([['deliveryid', 'ascending']]);
}

// Get delivery
var _findById = function(deliveryid, callback){
	_model.findOne({deliveryid: deliveryid}, function(err,doc) {
		if(err)
			callback(errorHandler.getErrorMessage(err), null);
		else
			callback(null, doc);
	});
}

// Add Delivery
var _add = function(delivery, callback){
	var newDelivery =  new _model();

	newDelivery.deliveryid = delivery.deliveryid;
	newDelivery.deliverytype = delivery.type;
	newDelivery.directory = delivery.directory;

	_model.create(newDelivery, function(err) {
		if(err)
			callback(errorHandler.getErrorMessage(err),null);
		else
			callback(null, newDelivery);
	});
}

// Update Delivery
var _update = function(delivery, callback){
	var update = {
		deliveryid: delivery.deliveryid,
		deliverytype: delivery.deliverytype,
		directory: delivery.directory
	}
	_model.findByIdAndUpdate(delivery._id, update, {new: true, upsert: true}, function(err, doc) {
		if(err)
			callback(errorHandler.getErrorMessage(err),null);
		else
			callback(null, doc);
	});
}


// Remove Delivery
var _remove = function(deliveryid, callback){
	var query = {deliveryid: deliveryid};
	_model.remove(query, function(err) {
		if(err)
			callback(errorHandler.getErrorMessage(err));
    else
    	callback(null, deliveryid);
	});
}

return {
	schema: _deliverySchema,
	model: _model,
	add: _add,
  update: _update,
	getById: _findById,
  getAll: _getAll,
	remove: _remove,

}

})();

module.exports = Delivery;
