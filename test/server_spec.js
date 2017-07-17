var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');

var app = require('../server-config.js');

describe('get api', function() {

  beforeEach(function (done) {
    var testUser = new User
  })

  it ('GET "/" should return "Hello!"', function(done) {

    request(app)
      .get('/')
      .expect(function(result) {
        // console.log('RESULT', result.text)
        expect(result.text).to.equal('Hello!');
      })
      .end(done);
  });

  it ('GET "/status" should return "OK"', function(done) {

    request(app)
      .get('/status')
      .expect(function(result) {
        expect(result.status).to.equal('OK');
      })
      .end(done);
  });

  it ('GET "/status" should return "Warning"', function(done) {

    request(app)
      .get('/status')
      .expect(function(result) {
        expect(result.status).to.equal('Warning');
      })
      .end(done);
  });

  it ('GET "/status" should return "Danger"', function(done) {

    request(app)
      .get('/status')
      .expect(function(result) {
        expect(result.status).to.equal('Danger');
      })
      .end(done);
  });

  it ('GET "/product" should return ', function(done))


  //it ('POST "/signup" should return', function(done) )

  //it ('POST "/login" should return', function(done) )

  //it ('POST "/logout" should return', function(done))

  //works for name, email, password, list of ingredients
  //it ('PUT "/user" should return')

  //retrieve user info or ingredients to avoid
  //it ('GET "/user" should return')


  //Possibly use status of OK, Warn, Danger
  //it ('should return {status: "Danger"} ')

});