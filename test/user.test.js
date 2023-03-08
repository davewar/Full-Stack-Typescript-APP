const chai = require('chai');
let expect = chai.expect;
let should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const { assert, use } = require('chai');
const { log } = require('console');

const logOutTest = require('./__testUtils__/userlogout');

const LOGINS = require('./__testUtils__/logins');

require('dotenv').config();
let userPassword = process.env.userpassword;

let accessToken = '';
let userID = '';

chai.use(chaiHttp);

describe('* User private view pages *', () => {
	describe('   Editor user person can view private pages', () => {
		// reset
		accessToken = '';

		it('1. Editor User logged in, person can view all users on the private page', (done) => {
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
						expect(res.body.should.have.keys('accesstoken', 'user'));
						expect(res.body.user.should.have.keys('id', 'name', 'role'));
						expect(res.body.user).to.have.property('role', 1);
						accessToken = res.body.accesstoken;

						//gets all users
						chai
							.request(server)
							.get('/user')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								expect(res.body.msg).to.be.a('array');

								expect(res.body.msg[0]).to.include.keys(
									'_id',
									'name',
									'email',
									'validated',
									'role',
									'active'
								);

								expect(res.body.msg[0]).to.have.property(
									'email',
									LOGINS.userEmail
								);

								//get id of user we will amend
								let deleteID = res.body.msg.filter(
									(item) => item.email === 'delete@testmocha.com'
								);

								userID = deleteID[0]._id;
								// log(userID);

								done();
							});
					}
				});
		});

		it('2. Editor User logged in, person can perform an UPDATE on private page', (done) => {
			chai
				.request(server)
				.put('/user/update/' + userID)
				.send({
					active: true,
					validated: true,
					role: 2,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.body.msg, 'User updated');
					done();
				});
		});

		it('2b. Editor User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/user')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					//check prev changes
					let person = res.body.msg.filter(
						(item) => item.email === 'delete@testmocha.com'
					);

					expect(person[0]).to.have.property('email', 'delete@testmocha.com');
					expect(person[0]).to.have.property('validated', 'true');
					expect(person[0]).to.have.property('role', 2);

					done();
				});
		});

		it('3. Any user logged in can NOT perform an UPDATE on private page if no `accessToken` included in headers', async function () {
			const res = await chai
				.request(server)
				.put('/user/update/' + userID)
				.send({
					active: true,
					validated: true,
					role: 2,
				})
				.set('content-type', 'application/json');
			// .set('Authorization', `Bearer ${accessToken}`);
			assert.equal(
				res.body.errors,
				'Invalid Authentication - Please log in.  from auth.js'
			);
		});

		it('4. Any user logged can NOT perform an UPDATE if not all required fields are supplied', (done) => {
			chai
				.request(server)
				.put('/user/update/' + userID)
				.send({
					active: true,
					role: 2,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.errors, 'Missing required fields');
					done();
				});
		});

		//only a role 2 can delete
		it('5. Editor User logged in, person can NOT perform an DELETE as they dont have this permission', (done) => {
			chai
				.request(server)
				.delete('/user/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.errors, 'Access denied 2');

					// logout user
					logOutTest(LOGINS.userOne, userPassword);
					done();
				});
		});

		it('6. No User logged in, person NOT able to view private page `/user`, expect view blocked', (done) => {
			chai
				.request(server)
				.get('/user')
				.end((err, res) => {
					if (err) done(err);
					assert.equal(
						res.body.errors,
						'Invalid Authentication - Please log in.  from auth.js'
					);

					done();
				});
		});
	});

	describe('   Basic user person can view private pages', () => {
		// reset
		accessToken = '';

		it('1. Basic user logged in, person can view all users on the private page', (done) => {
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
						expect(res.body.should.have.keys('accesstoken', 'user'));
						expect(res.body.user.should.have.keys('id', 'name', 'role'));
						expect(res.body.user).to.have.property('role', 0);

						accessToken = res.body.accesstoken;

						//gets all users
						chai
							.request(server)
							.get('/user')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								expect(res.body.msg).to.be.a('array');

								expect(res.body.msg[0]).to.include.keys(
									'_id',
									'name',
									'email',
									'validated',
									'role',
									'active'
								);

								expect(res.body.msg[0]).to.have.property(
									'email',
									LOGINS.userEmail
								);

								done();
							});
					}
				});
		});

		it('2. Basic user logged in, person can NOT perform an UPDATE on private page', (done) => {
			chai
				.request(server)
				.put('/user/update/' + userID)
				.send({
					active: true,
					validated: true,
					role: 2,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.errors, 'Access denied 2');
					done();
				});
		});

		//only a role 2 can delete
		it('3. Basic user logged in, person can NOT perform an DELETE as they dont have this permission', (done) => {
			chai
				.request(server)
				.delete('/user/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.errors, 'Access denied 2');

					// logout user
					logOutTest(LOGINS.userEmail, userPassword);
					done();
				});
		});
	});

	describe('   Admin user person can view private pages', () => {
		// reset
		accessToken = '';

		it('1. Admin User logged in, person can view all users on the private page', (done) => {
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
						expect(res.body.should.have.keys('accesstoken', 'user'));
						expect(res.body.user.should.have.keys('id', 'name', 'role'));
						expect(res.body.user).to.have.property('role', 2);
						accessToken = res.body.accesstoken;

						//gets all users
						chai
							.request(server)
							.get('/user')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								expect(res.body.msg).to.be.a('array');

								expect(res.body.msg[0]).to.include.keys(
									'_id',
									'name',
									'email',
									'validated',
									'role',
									'active'
								);

								expect(res.body.msg[0]).to.have.property(
									'email',
									LOGINS.userEmail
								);

								done();
							});
					}
				});
		});

		it('2. Admin User logged in, person can perform an UPDATE on private page', (done) => {
			chai
				.request(server)
				.put('/user/update/' + userID)
				.send({
					active: 'false', //<<<change
					validated: 'true',
					role: 2,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'User updated');
					done();
				});
		});

		it('2b. Admin User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/user')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					//check prev changes
					let person = res.body.msg.filter(
						(item) => item.email === 'delete@testmocha.com'
					);

					expect(person[0]).to.have.property('email', 'delete@testmocha.com');
					expect(person[0]).to.have.property('validated', 'true');
					expect(person[0]).to.have.property('role', 2);
					expect(person[0]).to.have.property('active', 'false');

					done();
				});
		});

		//only a role 2 can delete
		it('3. Admin User logged in, person can perform an DELETE as they have this permission', (done) => {
			chai
				.request(server)
				.delete('/user/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'user deleted');

					// logout user
					logOutTest(LOGINS.userTwo, userPassword);
					done();
				});
		});

		it('4. Admin User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/user')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg.length, 4);

					done();
				});
		});
	});
});
