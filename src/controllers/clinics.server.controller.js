'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Clinics = mongoose.model('Clinics');

/**
 * Create a Clinic
 */
module.exports.create = function(clinic) {

	Clinics.addClinic(billing,function(err, id) {
		if (err) {
			return {message: 'Error creating a clinic ' + errorHandler.getErrorMessage(err)};
		} else {
			return id;
		}
	});
};

/**
 * Update a Clinic
 */
module.exports.update = function(clinic) {

	Clinics.updateClinic(clinic.clinicid, clinic, {}, function(err, clinic) {

		if (err) {
			return { message: errorHandler.getErrorMessage(err) };
		} else {
			return clinic;
		}
	});
};

/**
 * Delete an Clinic
 */
module.exports.delete = function(clinicid) {

	Clinics.removeClinic(clinicid, function(err, clinic) {
		if (err) {
			return { message: errorHandler.getErrorMessage(err) };
		} else {
			return clinic;
		}
	});
};


// List All Clinics
module.exports.listBillings = function() {

	Clinics.getClinics(function(err, clinics){
		if(err){
			return {message: errorHandler.getErrorMessage(err)};
		}
		return clinics;
	});
};

// Get Single Clinic
module.exports.getCLinic = function(clinicid) {
	Customer.getClinicById(clinicid, function(err, clinic){
		if(err){
			return {message: errorHandler.getErrorMessage(err)};
		}
		return clinic;
	});
};

