'use strict';

/**
 * Module dependencies.
 */

var should = require('should');
var mongoose = require('mongoose');
var message = require('../models/messages.server.model');
var clinic = require('../models/clinics.server.model');

/**
 * Globals
 */
var newmessage;
var newclinic;

/**
 * Unit tests
 */
describe('Message Model Unit Tests:', function() {
	beforeEach(function(done) {
		// add a delivery record
		clinic.add({
			clinicname: 'CLINICNAME01',
			active: true
		}, function(err, doc) {
			newclinic = doc;
			message.add({
				clinicid: newclinic._id,
				message: 'original message text',
			}, function(err, msgdoc) {
				newmessage = msgdoc;
				done();
			});
		});
	});

	describe('Method Querying', function() {
		// Add 1 more records to total 2 delivery records.
		var secondmessage;
		beforeEach(function(done){
			message.add({
				clinicid: newclinic._id,
				message: 'this is the message of the second message',
			}, function(err, doc) {
				secondmessage = doc;
				done();
			});
		});

		it('should be able to find by clinicid without problems', function(done) {
			return message.getByClinicId(secondmessage.clinicid, function(err, docs) {
				should.not.exist(err);
				docs.length.should.equal(2);
				done();
			});
		});

		it('should be able to get all messages', function(done) {

			return message.getAll(function(err, docs) {
				should.not.exist(err);
				docs.length.should.equal(2);
				done();
			});
		});

		// Remove 1 records to total 1 delivery records.
		afterEach(function(done){
			message.remove(secondmessage, function(err) {
				done();
			});
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
		  newmessage.message = 'message updated message'
			return message.update(newmessage, function(err, doc) {
				should.not.exist(err);
				doc.message.should.equal('message updated message');
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			message.clinicid = '';
			message.message = '';
			return message.add(message, function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		message.remove(newmessage._id, function() {
			clinic.remove("CLINICNAME01", function() {
			})
			done();
		});
	});
});
