const chai = require('chai');
let expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
const { assert, use } = require('chai');

const Emails = require('../models/emails');
const LOGINS = require('./__testUtils__/logins');

require('dotenv').config();
let userPassword = process.env.userpassword;

let accessToken = '';
let idEmail = '';

chai.use(chaiHttp);

describe('* Emails *', () => {
	describe('   Contact Form', () => {
		//delete all emails - clean up
		before((done) => {
			Emails.deleteMany({}, function (err) {});
			done();
		});

		it('1. Customer able to submit contact form if all required fields are completed', (done) => {
			chai
				.request(server)
				.post('/api/email')
				.send({
					name: 'test name',
					email: 'test@dw123abc.com',
					comment: 'hi dave, i think your great!',
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);
					expect(res.status).to.be.equal(200);
					expect(res.body).to.be.a('object');
					res.body.should.have.property('msg');
					expect(res.body.msg).to.be.equal(
						'Thank you for your enquiry. We will be in contact with you shortly.'
					);

					done();
				});
		});

		it('2. Customer NOT able to submit contact form if a required field is missing', (done) => {
			chai
				.request(server)
				.post('/api/email')
				.set('content-type', 'application/json')
				.send({
					name: 'test name',
					email: 'test@dw123abc.com',
				})

				.end((err, res) => {
					if (err) {
						done(err);
					}

					expect(res.status).to.be.equal(401);
					expect(res.body).to.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors).not.to.be.equal(
						'Thank you for your enquiry. We will be in contact with you shortly.'
					);
					assert.equal(
						res.body.errors,
						'All form fields are required. Please try again'
					);

					done();
				});
		});
	});

	describe('   Emails private view pages', () => {
		// view emails
		it('1. No User logged in, person NOT able to view private page `/api/email`, expect view blocked', (done) => {
			chai
				.request(server)
				.get('/api/email')
				.end((err, res) => {
					if (err) done(err);

					assert.equal(
						res.body.errors,
						'Invalid Authentication - Please log in.  from auth.js'
					);

					done();
				});
		});
		it('2. Basic User able to login', (done) => {
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

					expect(res.status).to.be.equal(200);
					assert.equal(res.status, 200);
					expect(res.body).to.be.a('object');
					expect(res.body.accesstoken).to.be.a('string');
					expect(res.body.user).to.be.a('object');
					expect(res.body.user).to.have.property('id');
					expect(res.body.user).to.have.property('name');
					expect(res.body.user).to.have.property('role');

					let userAccessToken = res.body.accesstoken;
					assert.isString(userAccessToken);

					expect(res.body.user).to.have.property('role');
					let rt = res.headers['set-cookie'];

					expect(Object.keys(res.headers)).to.contain('set-cookie');

					// ('refreshtoken=eyJhbG...; Max-Age=86400; Path=/user/refresh_token; Expires=Mon, 23 Jan 2023 11:41:36 GMT; HttpOnly');
					expect(rt).to.be.a('Array');
					let userRefreshToken = rt[0].split(';')[0].split('refreshtoken=')[1];
					assert.typeOf(userRefreshToken, 'string');

					accessToken = userAccessToken;

					userRT = userRefreshToken;

					done();
				});
		});

		it('3. Basic User able to view emails once logged in', (done) => {
			chai
				.request(server)
				.get('/api/email')

				.set('content-type', 'application/json')

				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.status, 200);
					expect(res.body.msg).to.be.a('array');
					expect(res.body.msg[0]).to.be.a('object');

					expect(res.body.msg[0]).to.have.a.property('_id');
					expect(res.body.msg[0]).to.have.a.property('name');
					expect(res.body.msg[0]).to.have.a.property('comment');
					expect(res.body.msg[0]).to.have.a.property('createdAt');
					expect(res.body.msg[0]).to.have.a.property('updatedAt');

					expect(res.body.msg[0]).to.have.property('name', 'test name');
					expect(res.body.msg[0]).to.have.property(
						'email',
						'test@dw123abc.com'
					);
					expect(res.body.msg[0]).to.have.property(
						'comment',
						'hi dave, i think your great!'
					);

					expect(res.body.msg).to.have.length(1);

					idEmail = res.body.msg[0]._id;

					done();
				});
		});

		// delete email
		it('3. Basic User able to delete email once logged in', (done) => {
			chai
				.request(server)
				.delete('/api/email/' + idEmail)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 200);
					assert.equal(res.text, '"Item deleted"');

					done();
				});
		});
		// logout
		it('4. Basic User able to log out', (done) => {
			chai
				.request(server)
				.get('/user/logout')
				.send({
					email: LOGINS.userEmail,
					password: userPassword,
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 202);
					expect(res.body).to.be.a('object');
					assert.equal(res.body.msg, 'logged out');

					assert.equal(
						res.header['set-cookie'],
						'refreshtoken=; Path=/user/refresh_token; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
					);

					done();
				});
		});
	});
});
