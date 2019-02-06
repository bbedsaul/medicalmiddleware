'use strict';

/**
 * Module dependencies.
 */

var should = require('should');
var	mongoose = require('mongoose');
var	sentmessages = require('../models/sentmessages.server.model');
var	billing = require('../models/billings.server.model');

/**
 * Globals
 */
var newsentmessage;
var newbilling;

/**
 * Unit tests
 */
describe('Sentmessage Model Unit Tests:', function() {
	beforeEach(function(done) {
		// add a delivery record
		billing.add({
			billingname: 'BILLINGNAME01',
			active: true
		}, function(err, doc) {
			newbilling = doc;
			sentmessages.add({
				billingid: newbilling._id,
				message: 'original message text',
			}, function(err, msgdoc) {
				newsentmessage = msgdoc;
				done();
			});
		});
	});

	describe('Method Querying', function() {
		// Add 1 more records to total 2 delivery records.
		var secondsentmessage;
		beforeEach(function(done){
			sentmessages.add({
				billingid: newbilling._id,
				message: 'this is the message of the second sentmessage',
			}, function(err, doc) {
				secondsentmessage = doc;
				done();
			});
		});

		it('should be able to find by billingid without problems', function(done) {
			return sentmessages.getByBillingId(secondsentmessage.billingid, function(err, docs) {
				should.not.exist(err);
				docs.length.should.equal(2);
				done();
			});
		});

		it('should be able to get all sentmessages', function(done) {

			return sentmessages.getAll(function(err, docs) {
				should.not.exist(err);
				docs.length.should.equal(2);
				done();
			});
		});

		// Remove 1 records to total 1 delivery records.
		afterEach(function(done){
			sentmessages.remove(secondsentmessage, function(err) {
				done();
			});
		});
	});

	describe('Method Save', function() {

		it('should be able to save without problems', function(done) {
			newsentmessage.message = 'sentmessage updated message'
			return sentmessages.update(newsentmessage, function(err, doc) {
				should.not.exist(err);
				doc.message.should.equal('sentmessage updated message');
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			sentmessages.billingid = '';
			sentmessages.message = '';
			return sentmessages.add(sentmessages, function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		sentmessages.remove(newsentmessage._id, function() {
			billing.remove("BILLINGNAME01", function() {
			})
			done();
		});
	});
});
