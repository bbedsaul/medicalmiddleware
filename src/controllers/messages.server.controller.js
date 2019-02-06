'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Messages = mongoose.model('Messages'),
	_ = require('lodash'),
	authorization = require('./users/users.authorization.server.controller');;

/**
 * Create a Message
 */
exports.create = function(req, res) {
	var messages = new Messages(req.body);
	messages.user = req.user;

	messages.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messages);
		}
	});
};

/**
 * Show the current Message
 */
exports.read = function(req, res) {
	res.jsonp(req.messages);
};

/**
 * Update a Message
 */
exports.update = function(req, res) {
	var messages = req.messages ;

	messages = _.extend(messages , req.body);

	messages.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messages);
		}
	});
};

/**
 * Delete an Message
 */
exports.delete = function(req, res) {
	var messages = req.messages ;

	messages.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(messages);
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
	
	Messages.find().or(findQueryArray)
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName').populate('clinicid','clinicid').lean().exec(function(err, results) {
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
 * List of Messages
 */
exports.list = function(req, res) {	
	if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}
	authorization.checkAccess(req, '57a11cc4a4bba792aeeeb2c4', 'read')
	.then(function(accessResult){
		var params = {};
		if(accessResult === 'hasAccessIfUserCreatedIt'){
			params.user = req.user.id;
		}
		
		params.parentId = req.query.parentId;
		
		Messages.find(params)
				.sort('-created').populate('user', 'displayName').populate('clinicid','clinicid').exec(function(err, messages) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(messages);
			}
		});
	})
	.catch(function(err){
		return res.status(403).send({message: err});
	});
};

