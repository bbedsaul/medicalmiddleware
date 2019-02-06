'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Delivery = mongoose.model('Delivery'),
	_ = require('lodash'),
	authorization = require('./users/users.authorization.server.controller');;

/**
 * Create a Delivery
 */
exports.create = function(req, res) {
	var delivery = new Delivery(req.body);
	delivery.user = req.user;

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Show the current Delivery
 */
exports.read = function(req, res) {
	res.jsonp(req.delivery);
};

/**
 * Update a Delivery
 */
exports.update = function(req, res) {
	var delivery = req.delivery ;

	delivery = _.extend(delivery , req.body);

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Delete an Delivery
 */
exports.delete = function(req, res) {
	var delivery = req.delivery ;

	delivery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Search matching multiple columns to a single search value
 */
exports.search = function(req, res) {	
	var findQueryArray = [];
	var searchKeys = req.query.searchKeys;
	if(!searchKeys){
		return res.status(400).send('Search key(s) missing');
	}
	var searchKeyArray = searchKeys.split(',');
	searchKeyArray.forEach(function(key){
		var findQuery = {};
		findQuery[key] = { "$regex": req.query.searchValue, "$options": "i" };
		findQueryArray.push(findQuery);
	});
	
	Delivery.find().or(findQueryArray)
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').populate('deliveryid','deliveryid').lean().exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(results);
		}
	});
};


/**
 * List of Deliveries
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}
	authorization.checkAccess(req, '57a11d06a4bba792aeeeb2c6', 'read')
	.then(function(accessResult){
		var params = {};
		if(accessResult === 'hasAccessIfUserCreatedIt'){
			params.user = req.user.id;
		}
		
		params.parentId = req.query.parentId;
		
		Delivery.find(params)
				.sort('-created').populate('user', 'displayName').populate('deliveryid','deliveryid').exec(function(err, delivery) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(delivery);
			}
		});
	})
	.catch(function(err){
		return res.status(403).send({message: err});
	});
};

