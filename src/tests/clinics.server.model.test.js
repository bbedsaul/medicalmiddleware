'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var clinic = require('../models/clinics.server.model');
var billing = require('../models/billings.server.model');
var should = require('should');

/**
 * Globals
 */
var newclinic;
var newbilling;

/**
 * Unit tests
 */
describe('Clinic Model Unit Tests:', function() {

	beforeEach(function(done) {
		// add a delivery record
		billing.add({
			billingname: 'BILLINGNAME',
			active: true
		}, function(err, doc) {
			newbilling = doc;
			clinic.add({
				clinicname: 'CLINICNAME',
				active: true,
			}, function(err, clinicdoc) {
				newclinic = clinicdoc;
				done();
			});
		});
	});

  describe('Method Querying', function() {
    // Add 1 more records to total 2 delivery records.
    before(function(done){
      clinic.add({
        clinicname: 'CLINICNAME2',
        active: false,
      }, function(err, doc) {
        done();
      });

    });

    it('should be able to find by clinicname without problems', function(done) {
      return clinic.getByName("CLINICNAME", function(err, doc) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to get all clinics', function(done) {

      return clinic.getAll(function(err, docs) {
        should.not.exist(err);
        docs.length.should.equal(2);
        done();
      });
    });

    // Remove 1 records to total 1 delivery records.
    after(function(done){
      clinic.remove("CLINICNAME2", function() {
        done();
      });
    });
  });

	describe('Method Save', function() {

		it('should show an error when adding a record with duplicate clinicname', function(done) {
			return clinic.add({
				clinicname: 'CLINICNAME',
				active: true,
			}, function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			newclinic.active = false;
			newclinic.billingid = newbilling._id;
			return clinic.update(newclinic, function(err, doc) {
				should.not.exist(err);
				doc.active.should.equal(false);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			clinic.clinicname = '';
			clinic.billingid = '';

			return clinic.add(clinic, function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		clinic.remove("CLINICNAME", function() {
			billing.remove("BILLINGNAME", function() {
				done();
			})
		});
	});
});
