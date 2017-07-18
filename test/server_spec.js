var request = require('supertest');
var expect = require('chai').expect;
var express = require('express');
var User = require('../db/models/user.js');

var app = require('../server-config.js');

describe('get api', function() {

  beforeEach(function (done) {
    var testUser = {
      first_name: 'Bob',
      last_name: 'Jones',
      username: 'bobjones@bob.com',
      avoidables: ['whey'],
      password: 'test123'
    };
    User.create(testUser, done);
  });

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
    this.timeout(15500);
    request(app)
      .get('/status')
      .query({username: 'bobjones@bob.com', upc: '1254631509'}) //Dentyne Fire gum
      .expect(function(result) {
       // console.log(result);
        expect(result.body.status).to.equal('OK');
        //done();
      })
      .end(done);

  });

  // it ('GET "/status" should return "Danger"', function(done) {

  //   request(app)
  //     .get('/status')
  //     .query({username: 'bobjones@bob.com', upc: '1600044281'}) //Nature Valley Sweet & Salty Nut Bar
  //     .expect(function(result) {
  //       expect(result.status).to.equal('Danger');
  //       //done();
  //     })
  //     .end(done);

  // });

  // it ('GET "/status" should return "Danger"', function(done) {

  //   request(app)
  //     .get('/status')
  //     .expect(function(result) {
  //       expect(result.status).to.equal('Warning');
  //     })
  //     .end(done);
  // });

  // it ('GET "/product" should return ', function(done) )


  it ('POST "/signup" should create a new user', function(done) {
    request(app)
      .post('/signup')
      .send({
        first_name: 'Sue',
        last_name: 'Dough',
        username: 'suedough@pillsbury.com',
        avoidables: ['gluten'],
        password: 'popnfresh'
      })
      .expect(function() {
        User.findOne({username: 'suedough@pillsbury.com'}, function(err, user) {
          expect(err).to.be.null;
          expect(user.first_name).to.equal('Sue');
          expect(user.last_name).to.equal('Dough');
          expect(user.username).to.equal('suedough@pillsbury.com');
          expect(user.avoidables).to.equal('gluten');
          expect(user.password).to.equal('popnfresh');
          //done();
        });
      })
      .end(done);
    });

  // it ('POST "/login" should return', function(done) {

  // })

  //it ('POST "/logout" should return', function(done))

  //works for name, email, password, list of ingredients
  //it ('PUT "/user" should return')

  //retrieve user info or ingredients to avoid
  //it ('GET "/user" should return')


  //Possibly use status of OK, Warn, Danger
  //it ('should return {status: "Danger"} ')

});