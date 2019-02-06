'use strict';

/**
 * Module dependencies.
 */
 var Billings = require('../models/billings.server.model');

/**
 * Create a Billing
 */
module.exports.create = function(billing) {

	Billings.addBilling(billing,function(err, id) {
		if (err) {
				return {message: 'Error creating a billing ' + errorHandler.getErrorMessage(err)};
		} else {
			return id;
		}
	});
};

/**
 * Update a Billing
 */
module.exports.update = function(billing) {

  Billings.updateBilling(billing.billingid, billing, {}, function(err, billing) {

		if (err) {
			return { message: errorHandler.getErrorMessage(err) };
		} else {
			return billing;
		}
	});
};

/**
 * Delete an Billing
 */
module.exports.delete = function(id) {

	Billings.removeBilling(id, function(err, billing) {
		if (err) {
			return { message: errorHandler.getErrorMessage(err) };
		} else {
			return billing;
		}
	});
};

// List All Billings
module.exports.listBillings = function() {

	Billings.getBillings(function(err, billings){
		if(err){
			return {message: errorHandler.getErrorMessage(err)};
		}
		return billings;
	});
};

// Get Single Billing
module.exports.getBilling = function(billingid) {
	Billings.getBillingById(billingid, function(err, billing){
			if(err){
				return {message: errorHandler.getErrorMessage(err)};
			}
			return billing;
	});
};


