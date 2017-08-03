var request = require('supertest');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var express = require('express');
var User = require('../db/models/user.js');
var Product = require('../db/models/product.js');

var app = require('../server-config.js');


var clearDB = function (done) {
  //mongoose.connection.db.dropCollection('usersdb', done);
  //mongoose.connection.collections['products'].remove(done);
  mongoose.connection.db.dropDatabase(done);
};

describe('get api', function() {
  var productID;

  beforeEach(function (done) {
    clearDB(function(){
      var newProd = new Product({upc: '1254631509', title: 'Dentyne Fire gum' });
      newProd.save(function(err, product){
        var testUser = {
          user_id: '1234',
          first_name: 'Bob',
          last_name: 'Jones',
          username: 'bobjones@bob.com',
          avoidables: ['whey'],
          password: 'test123'
        };

        var user = new User(testUser);
        productID = product._id;
        user.favorites.push(product._id);
        user.save(done);

      });

    });
  });

  it('GET "/test" should return "Hello!"', function(done) {

    request(app)
      .get('/test')
      .expect(function(result) {
        // console.log('RESULT', result.text)
        expect(result.text).to.equal('Hello!');
      })
      .end(done);
  });

  xit('GET "/status" should return "OK"', function(done) {
    this.timeout(15500);
    request(app)
      .get('/status')
      .query({user_id: '1234', upc: '1600044281'}) //Dentyne Fire gum
      .expect(function(result) {
       // console.log(result);
        expect(result.body.status).to.equal('OK');
        //done();
      })
      .end(done);

  });

  xit('GET "/status" should return "Danger"', function(done) {
    this.timeout(15500);
    request(app)
      .get('/status')
      .query({user_id: '1234', upc: '1600044281'}) //Nature Valley Sweet & Salty Nut Bar
      .expect(function(result) {
        expect(result.body.status).to.equal('DANGER');
        //done();
      })
      .end(done);

  });

  it ('Post "/favorites" should add a product to user favorites', function(done) {
    this.timeout(25500);
    request(app)
      .post('/favorites')
      .send({
        product_id: productID,
        user_id: '1234'
      })
      .expect(function(result) {
        expect(result.body.status).to.equal('success');

        User.findOne({user_id:'1234'}).populate('favorites').exec(function(err, user){
          //console.log(user);
          expect(user.favorites).to.be.an('array').that.is.not.empty;
          expect(user.favorites[0].title).to.equal('Dentyne Fire gum');
        });
      })
      .end(done);

  });

  it ('Get "/favorites" should return list of favorites for user', function(done) {
      this.timeout(25500);

       request(app)
      .post('/favorites')
      .send({
        product_id: productID,
        user_id: '1234'
      })
      .expect(function(result) {
        expect(result.body.status).to.equal('success');
        console.log('fav added');

        request(app)
        .get('/favorites')
        .send({
          user_id: '1234'
        })
        .expect(function(result) {
          expect(result.body.status).to.equal('success');

          User.findOne({user_id:'1234'}).populate('favorites').exec(function(err, user){
            console.log(user);
            expect(user.favorites).to.be.an('array').that.is.not.empty;
            expect(user.favorites[0].title).to.exist;
            expect(user.favorites[0].title).to.equal('Dentyne Fire gum');
          });
        })
        .end(done);


      })




    });

  it ('Delete "/favorites" should delete all user favorites', function(done) {
    this.timeout(25500);
    //console.log(productID);
    request(app)
      .delete('/favorites')
      .send({
        user_id: '1234'
      })
      .expect(function(result) {
        expect(result.body.status).to.equal('success');

        User.findOne({user_id:'1234'}).populate('favorites').exec(function(err, user){
          //console.log(user);
          expect(user.favorites).to.be.an('array').that.is.empty;
        });
      })
      .end(done);

  });



  // // it ('GET "/status" should return "Danger"', function(done) {

  // //   request(app)
  // //     .get('/status')
  // //     .expect(function(result) {
  // //       expect(result.status).to.equal('Warning');
  // //     })
  // //     .end(done);
  // // });

  // // it ('GET "/product" should return ', function(done) )


  // it ('POST "/signup" should create a new user', function(done) {
  //   request(app)
  //     .post('/signup')
  //     .send({
  //       first_name: 'Sue',
  //       last_name: 'Dough',
  //       username: 'suedough@pillsbury.com',
  //       avoidables: ['gluten'],
  //       password: 'popnfresh'
  //     })
  //     .expect(function() {
  //       User.findOne({username: 'suedough@pillsbury.com'}, function(err, user) {
  //         expect(err).to.be.null;
  //         expect(user.first_name).to.equal('Sue');
  //         expect(user.last_name).to.equal('Dough');
  //         expect(user.username).to.equal('suedough@pillsbury.com');
  //         expect(user.avoidables).to.equal('gluten');
  //         expect(user.password).to.equal('popnfresh');
  //         //done();
  //       });
  //     })
  //     .end(done);
  //   });

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