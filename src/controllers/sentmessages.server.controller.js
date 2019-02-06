'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sentmessages = mongoose.model('Sentmessages'),
	_ = require('lodash'),
	authorization = require('./users/users.authorization.server.controller');;

/**
 * Create a Sentmessage
 */
exports.create = function(req, res) {
	var sentmessages = new Sentmessages(req.body);
	sentmessages.user = req.user;

	sentmessages.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sentmessages);
		}
	});
};

/**
 * Show the current Sentmessage
 */
exports.read = function(req, res) {
	res.jsonp(req.sentmessages);
};

/**
 * Update a Sentmessage
 */
exports.update = function(req, res) {
	var sentmessages = req.sentmessages ;

	sentmessages = _.extend(sentmessages , req.body);

	sentmessages.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sentmessages);
		}
	});
};

/**
 * Delete an Sentmessage
 */
exports.delete = function(req, res) {
	var sentmessages = req.sentmessages ;

	sentmessages.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sentmessages);
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
	
	Sentmessages.find().or(findQueryArray)
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').populate('billingid','billingid').lean().exec(function(err, results) {
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
 * List of Sentmessages
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}
	authorization.checkAccess(req, '57a2340ef2eebaceaebbcef3', 'read')
	.then(function(accessResult){
		var params = {};
		if(accessResult === 'hasAccessIfUserCreatedIt'){
			params.user = req.user.id;
		}
		
		params.parentId = req.query.parentId;
		
		Sentmessages.find(params)
				.sort('-created').populate('user', 'displayName').populate('billingid','billingid').exec(function(err, sentmessages) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(sentmessages);
			}
		});
	})
	.catch(function(err){
		return res.status(403).send({message: err});
	});
};
