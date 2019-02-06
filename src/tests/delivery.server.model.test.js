'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
var mongoose = require('mongoose');
var delivery = require('../models/delivery.server.model');

/**
 * Globals
 */
var newDelivery;

/**
 * Unit tests
 */
describe('Delivery Model Unit Tests:', function() {

	beforeEach(function(done) {
		delivery.add({
			deliveryid: 'TESTDELIVERYID',
			type: 'DIR',
			directory: '/Users/bbedsaul/test'
		}, function(err, doc) {
			newDelivery = doc;
			done();
		});

	});

	describe('Method Querying', function() {
		// Add 1 more records to total 2 delivery records.
		before(function(done){
			delivery.add({
				deliveryid: 'TESTDELIVERYID2',
				type: 'DIR',
				directory: '/Users/bbedsaul/test'
			}, function(err, doc) {
				done();
			});

		});

		it('should be able to find by deliveryid without problems', function(done) {
			return delivery.getById("TESTDELIVERYID", function(err, doc) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to get all deliverys', function(done) {

			return delivery.getAll(function(err, docs) {
				should.not.exist(err);
				docs.length.should.equal(2);
				done();
			});
		});

		// Remove 1 records to total 2 delivery records.
		after(function(done){
			delivery.remove("TESTDELIVERYID2", function() {
				done();
			});
		});
	});

	describe('Method Save', function() {

		it('should show an error when adding a record with duplicate deliveryid', function(done) {
			return delivery.add({
					deliveryid: 'TESTDELIVERYID',
					type: 'DIR',
					directory: '/Users/bbedsaul/test'
				}, function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to update without problems', function(done) {

			// Changing type to 'UPDT'
			newDelivery.deliverytype = 'UPDT';
			return delivery.update(newDelivery, function(err, doc) {
          should.not.exist(err);
          doc.deliverytype.should.equal('UPDT');
          done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			delivery.deliveryid = '';
			
			delivery.deliverytype = '';
			
			delivery.directory = '';
			

			return delivery.add(delivery, function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		delivery.remove("TESTDELIVERYID", function() {
			done();
		});
	});
});
