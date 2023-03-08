const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = require('assert');
const { log } = console;

const logOutTest = require('./__testUtils__/userlogout');
const LOGINS = require('./__testUtils__/logins');

require('dotenv').config();
let userPassword = process.env.userpassword;

const User = require('../models/user');
let accessToken = '';

chai.use(chaiHttp);

describe('* Register user *', () => {
	// reset

	describe('   Register', () => {
		before((done) => {
			User.deleteOne({ email: 'delete@testmocha.com' }, function (err) {});
			User.deleteOne({ email: 'delete1@testmocha.com' }, function (err) {});
			done();
		});

		it('1. No User logged in, person NOT able to create new user as they dont have this permission, expect error message ', (done) => {
			chai
				.request(server)
				.post('/user/register')
				.send({
					name: 'deletename',
					email: 'delete@testmocha.com',
					password: userPassword,
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					expect(res.status).to.be.equal(401);
					expect(res.body).to.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors).to.be.equal(
						'Invalid Authentication - Please log in.  from auth.js'
					);

					done();
				});
		});

		it('2. Basic User logged in, person NOT able to create new user as they dont have this permission, expect error message', (done) => {
			// reset
			accesstoken = '';
			chai
				.request(server)
				.post('/user/login')
				.send({
					email: LOGINS.userEmail,
					password: userPassword,
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					if (res.body.message) {
						expect(
							res.body.message,
							'Too many login attempts. Please try again after a 60 second pause'
						);
						done();
					} else {
						accessToken = res.body.accesstoken;

						//gets all users
						chai
							.request(server)
							.post('/user/register')
							.send({
								name: 'nochance',
								email: 'nochance@testmocha.com',
								password: userPassword,
							})
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								expect(res.status).to.be.equal(403);

								expect(res.body.errors).to.be.equal('Access denied 2');

								// logout user
								logOutTest(LOGINS.userEmail, userPassword);

								done();
							});
					}
				});
		});

		it('3. Editor User logged in, person able to create new user', (done) => {
			accesstoken = '';
			chai
				.request(server)
				.post('/user/login')
				.send({
					email: LOGINS.userOne,
					password: userPassword,
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					if (res.body.message) {
						expect(
							res.body.message,
							'Too many login attempts. Please try again after a 60 second pause'
						);
						done();
					} else {
						accessToken = res.body.accesstoken;

						chai
							.request(server)
							.post('/user/register')
							.send({
								name: 'deletename',
								email: 'delete@testmocha.com',
								password: userPassword,
							})
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								expect(res.status).to.be.equal(200);
								expect(res.body).to.be.a('object');
								res.body.should.have.property('msg');
								expect(res.body.msg).to.be.equal(
									'Please check your email and activate your account using the link'
								);

								done();
							});
					}
				});
		});

		it('4. Editor User logged in, person NOT able to create new user if account already exists, expect error message', (done) => {
			chai
				.request(server)
				.post('/user/register')
				.send({
					name: 'deletename',
					email: 'delete@testmocha.com',
					password: userPassword,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					expect(res.status).to.be.equal(409);
					expect(res.body.errors).to.be.equal('Account already exists');

					done();
				});
		});

		it('5. Editor User logged in, person NOT able to create new user with an invalid email field, expect error message', (done) => {
			chai
				.request(server)
				.post('/user/register')
				.send({
					name: 'test name',
					password: '123456789',
					email: 'test',
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors).to.be.equal(
						'Email is not valid. Please re-enter your email address'
					);

					done();
				});
		});

		it('6. Editor User logged in, person NOT able to create new user with a missing field, expect error message', (done) => {
			chai
				.request(server)
				.post('/user/register')
				.send({
					name: 'test name',
					password: '123456789',
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors).to.be.equal(
						'Missing Information. Please try again'
					);

					done();
				});
		});

		it('7. Admin User logged in, person able to create new user', (done) => {
			// reset
			accessToken = '';
			chai
				.request(server)
				.post('/user/login')
				.send({
					email: LOGINS.userTwo,
					password: userPassword,
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					if (res.body.message) {
						expect(
							res.body.message,
							'Too many login attempts. Please try again after a 60 second pause'
						);
						done();
					} else {
						accessToken = res.body.accesstoken;

						//gets all users
						chai
							.request(server)
							.post('/user/register')
							.send({
								name: 'delete1name',
								email: 'delete1@testmocha.com',
								password: userPassword,
							})
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								// log('DW sss', res.status);
								// log('DW', res.text);
								// log('DW', res.body);

								expect(res.status).to.be.equal(200);
								expect(res.body).to.be.a('object');
								res.body.should.have.property('msg');
								expect(res.body.msg).to.be.equal(
									'Please check your email and activate your account using the link'
								);

								// logout user
								logOutTest(LOGINS.userTwo, userPassword);

								done();
							});
					}
				});
		});

		//end of describe
	});
});
