'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var billing = require('../models/billings.server.model');
var delivery = require('../models/delivery.server.model');

var should = require('should');

/**
 * Globals
 */
var newbilling;
var newdelivery;

/**
 * Unit tests
 */
describe('Billing Model Unit Tests:', function() {

	beforeEach(function(done) {
	  // add a delivery record
    delivery.add({
      deliveryid: 'TESTDELIVERYID',
      type: 'DIR',
      directory: '/Users/bbedsaul/test'
    }, function(err, doc) {
      newdelivery = doc;
      billing.add({
        billingname: 'BILLINGID',
        active: true,
      }, function(err, billdoc) {
        newbilling = billdoc;
        done();
      });
    });
	});

  describe('Method Querying', function() {
    // Add 1 more records to total 2 delivery records.
    before(function(done){
      billing.add({
        billingname: 'BILLINGID2',
        active: false,
      }, function(err, doc) {
        done();
      });

    });

    it('should be able to find by billingname without problems', function(done) {
      return billing.getByName("BILLINGID", function(err, doc) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to get all billings', function(done) {

      return billing.getAll(function(err, docs) {
        should.not.exist(err);
        docs.length.should.equal(2);
        done();
      });
    });

    // Remove 1 records to total 1 delivery records.
    after(function(done){
      billing.remove("BILLINGID2", function() {
        done();
      });
    });
  });

	describe('Method Save', function() {

    it('should show an error when adding a record with duplicate billingname', function(done) {
      return billing.add({
        billingname: 'BILLINGID',
        active: true,
      }, function(err) {
        should.exist(err);
        done();
      });
    });

		it('should be able to save without problems', function(done) {
		  newbilling.active = false;
      newbilling.deliveryid = newdelivery._id;

			return billing.update(newbilling, function( err, doc ) {
				should.not.exist(err);
        doc.active.should.equal(false);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			billing.billingname = '';
			
			billing.deliveryid = '';
			

			return billing.add(billing, function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		billing.remove("BILLINGID", function() {
		  delivery.remove("TESTDELIVERYID", function() {
        done();
      })
    });
	});
});
