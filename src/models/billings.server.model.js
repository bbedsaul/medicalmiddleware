'use strict';

var Billing = (function() {

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var errorHandler = require('./errors.server.model.js');

/**
 * Billing Schema
 */
var _billingSchema = new Schema({
	billingname: {
		required: true,
		unique: true,
		type: String
	},
	active: {
		required: true,
		type: Boolean
	},
	delivery: {
		type: Schema.Types.ObjectId,
			ref: 'deliveries'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

var _model = mongoose.model('billings', _billingSchema);


// Get billings
var _getAll = function(callback, limit){
	_model.find({}, function(err, docs) {
	  if(err)
	    callback(errorHandler.getErrorMessage(err), null);
    else
      callback(null, docs);
  }).limit(limit).sort([['billingname', 'ascending']]);
}

// Get billing
var _getByName = function(billingname, callback){
	_model.findOne( { billingname: billingname }, function(err, doc) {
	  if(err)
	    callback(errorHandler.getErrorMessage(err), null);
    else
      callback(null, doc);
  });
}

// Add Billing
var _add = function(billing, callback){
	var newBilling =  new _model();

  newBilling.billingname = billing.billingname;
  newBilling.active = billing.active;
  newBilling.delivery = billing.delivery;

	newBilling.save(function(err, doc) {
	  if(err)
      callback(errorHandler.getErrorMessage(err),null);
    else
      callback(null, doc);
  });
}

// Update Billing
var _update = function(billing, callback){
	var update = {
		billingid: billing.billingid,
		active: billing.active,
		deliveryid: billing.deliveryid
	}
	_model.findByIdAndUpdate(billing._id, update, {new: true, upsert: true}, function(err, doc) {
	  if(err)
	    callback(errorHandler.getErrorMessage(err), null);
    else
      callback(null, doc);
  });
}


// Remove Billing
var _remove = function(billingname, callback){
	var query = {billingname: billingname};
	_model.remove(query, function(err) {
	  if(err)
	    callback(errorHandler.getErrorMessage(err), null);
    else
      callback(null, billingname);
  });
}

return {
  model: _model,
  schema: _billingSchema,
  add: _add,
  update: _update,
  getByName: _getByName,
  getAll: _getAll,
  remove: _remove,
}

})();

module.exports = Billing;
