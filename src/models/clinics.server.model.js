'use strict';

var Clinic = (function() {

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var errorHandler = require('./errors.server.model.js');

/**
 * Clinic Schema
 */
var _clinicSchema = new Schema({
	clinicname: {
		required: true,
		unique: true,
		type: String
	},
	active: {
		required: true,
		default: true,
		type: Boolean		
	},
	billingid: {
		type: Schema.Types.ObjectId,
		ref: 'Billings'		
	},
	created: {
		type: Date,
		default: Date.now
	}
});

var _model = mongoose.model('clinics', _clinicSchema);


// Get Clinics
var _getAll = function(callback, limit){
	_model.find({}, function(err, docs) {
		if(err)
      callback(errorHandler.getErrorMessage(err), null);
		else
			callback(null, docs);
	}).limit(limit).sort([['clinicname', 'ascending']]);
}

// Get Clinic by clinic
var _getByName = function(clinicname, callback){
	_model.findOne({clinicname: clinicname}, function(err, doc) {
		if(err)
			callback(errorHandler.getErrorMessage(err), null);
		else
			callback(null, doc);
	})
}

// Add Clinics
var _add = function(clinic, callback){
	var newclinic = new _model();
	newclinic.clinicname = clinic.clinicname,
	newclinic.active = clinic.active,
  newclinic.billingid = clinic.billingid
	_model.create(newclinic, function(err) {
		if(err)
			callback(errorHandler.getErrorMessage(err), null);
		else
			callback(null, newclinic);
	});
}

// Update Clinics
var _update = function(clinic, callback){
	var update = {
		clinicname: clinic.clinicname,
		active: clinic.active,
		billingid: clinic.billingid
	}
	_model.findByIdAndUpdate(clinic._id, update, {new: true, upsert: true}, function(err, doc) {
		if (err)
			callback(errorHandler.getErrorMessage(err), null);
		else
			callback(null, doc);
	});
}


// Remove Clinic
var _remove = function(clinicname, callback){
	var query = {clinicname: clinicname};
	_model.remove(query, function(err) {
		if(err)
			callback(errorHandler.getErrorMessage(err), null);
		else
			callback(null, clinicname);
	});
}

return {
	schema: _clinicSchema,
	model: _model,
	add: _add,
	update: _update,
	getByName: _getByName,
	getAll: _getAll,
	remove: _remove,
}

})();

module.exports = Clinic;
