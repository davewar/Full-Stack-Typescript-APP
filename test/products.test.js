const chai = require('chai');
let expect = chai.expect;
let should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const { assert, use } = require('chai');

const { v4: uuidv4 } = require('uuid');
const logOutTest = require('./__testUtils__/userlogout');
const LOGINS = require('./__testUtils__/logins');

require('dotenv').config();
let userPassword = process.env.userpassword;

const Product = require('../models/product');
let accessToken = '';
let userID = '';

let {
	projectOne,
	changeProjectOne,
	projectTwo,
} = require('./__testUtils__/projects');

let dte = new Date().toLocaleString().replace(',', '');

chai.use(chaiHttp);

describe('* Customer private view pages *', () => {
	describe('   Editor user person can view private pages', () => {
		//reset
		before((done) => {
			Product.deleteMany({}, function (err) {});
			done();
		});

		it('1. Editor User logged in, person can view all projects on the private page', (done) => {
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
						expect(res.body.user).to.have.property('role', 1);
						accessToken = res.body.accesstoken;
						chai
							.request(server)
							.get('/api/product')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								assert.equal(res.body.msg, 'No projects found');

								done();
							});
					}
				});
		});

		it('2. Editor User logged in, person can perform an CREATE a project on private page', (done) => {
			chai
				.request(server)
				.post('/api/product/create')
				.send({
					...projectOne,
					comments: {
						id: uuidv4(),
						comments: 'blah..',
						dte,
						createdBy: LOGINS.userOne,
					},
					assignedTo: LOGINS.userEmail,
					createdBy: LOGINS.userOne,
					lastUpdatedBy: LOGINS.userOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'New project added');
					res.status.should.equal(200);
					done();
				});
		});

		it('2b. Editor User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);
					expect(res.body.msg[0]).to.have.property(
						'customerID',
						'customer1@gmail.com'
					);
					expect(res.body.msg[0]).to.have.property(
						'title',
						'Title project1...'
					);
					expect(res.body.msg[0]).to.have.property('projectCompleted', false);
					expect(res.body.msg[0]).to.have.property('paid', false);

					//empty array - no payments made yet
					assert.isArray(res.body.msg[0].payments);

					assert.isArray(res.body.msg[0].comments);
					expect(res.body.msg[0].comments[0]).to.have.keys([
						'id',
						'comments',
						'dte',
						'createdBy',
					]);
					expect(res.body.msg[0].comments[0].comments).to.equal('blah..');
					expect(res.body.msg[0].comments[0].createdBy).to.equal(
						LOGINS.userOne
					);

					assert.isArray(res.body.msg[0].type);
					// values of array
					expect(res.body.msg[0].type).to.members([
						'Excel',
						'Access',
						'Website',
						'BI',
					]);

					expect(res.body.msg[0]).to.have.property('price', 100);

					expect(res.body.msg[0]).to.have.property(
						'description',
						'Description....'
					);
					// expect(res.body.msg[0].property).to.be.equal('false');
					expect(res.body.msg[0]).to.have.property(
						'assignedTo',
						'testdw@testmocha.com'
					);
					expect(res.body.msg[0]).to.have.property(
						'createdBy',
						'1@testmocha.com'
					);
					expect(res.body.msg[0]).to.have.property(
						'lastUpdatedBy',
						'1@testmocha.com'
					);

					userID = res.body.msg[0]._id;

					done();
				});
		});

		it('3. Any user logged in can NOT perform an CREATE on private page if no `accessToken` included in headers', (done) => {
			chai
				.request(server)
				.post('/api/customer/create')
				.send({
					...projectOne,
					comments: {
						id: uuidv4(),
						comments: 'blah..',
						dte,
						createdBy: LOGINS.userOne,
					},
					assignedTo: LOGINS.userEmail,
					createdBy: LOGINS.userOne,
					lastUpdatedBy: LOGINS.userOne,
				})
				.set('content-type', 'application/json')
				// .set('Authorization', `Bearer ${accessToken}`);
				.end((err, res) => {
					if (err) done(err); //
					assert.equal(
						res.body.errors,
						'Invalid Authentication - Please log in.  from auth.js'
					);
					res.status.should.equal(401);
					done();
				});
		});

		it('4. Any user logged can NOT perform an UPDATE if not all required fields are supplied', (done) => {
			chai
				.request(server)
				.post('/api/product/create')
				.send({
					...projectOne,
					comments: {
						id: uuidv4(),
						comments: 'blah..',
						dte,
						createdBy: LOGINS.userOne,
					},
					// assignedTo: LOGINS.userEmail,
					createdBy: LOGINS.userOne,
					lastUpdatedBy: LOGINS.userOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)

				.end((err, res) => {
					if (err) done(err);

					assert.equal(
						res.body.errors,
						'Missing information. Please try again'
					);
					done();
				});
		});

		it('5. Editor User logged in, person can perform an UPDATE a project on private page', (done) => {
			chai
				.request(server)
				.put('/api/product/update/' + userID)
				.send({
					...changeProjectOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'Project updated');

					done();
				});
		});

		it('6b. Editor User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);
					expect(res.body.msg[0]).to.have.property(
						'customerID',
						'customer1@gmail.com'
					);
					expect(res.body.msg[0]).to.have.property(
						'title',
						'Title project1... CHANGED'
					);
					expect(res.body.msg[0]).to.have.property('projectCompleted', true);
					expect(res.body.msg[0]).to.have.property(
						'description',
						'Description....CHANGED'
					);

					expect(res.body.msg[0]).to.have.property('paid', true);
					expect(res.body.msg[0].payments[0]).to.have.property(
						'paidAmount',
						'5'
					);
					expect(res.body.msg[0].payments[0]).to.have.property(
						'paymentDate',
						'03/01/2023'
					);
					expect(res.body.msg[0].payments[0]).to.have.property(
						'createdBy',
						'1@testmocha.com'
					);

					expect(res.body.msg[0].comments).to.have.lengthOf(2);
					expect(res.body.msg[0].comments[0].id).to.equal(1);
					expect(res.body.msg[0].comments[0].comments).to.equal('blah..');
					expect(res.body.msg[0].comments[0].createdBy).to.equal(
						LOGINS.userOne
					);
					expect(res.body.msg[0].comments[0].dte).to.equal(
						'17/01/2023 16:52:58'
					);

					expect(res.body.msg[0].comments[1].id).to.equal(2);
					expect(res.body.msg[0].comments[1].comments).to.equal('blah..2');
					expect(res.body.msg[0].comments[1].dte).to.equal(
						'18/01/2023 17:52:58'
					);
					expect(res.body.msg[0].comments[1].createdBy).to.equal(
						LOGINS.userOne
					);

					expect(res.body.msg[0].type).to.members(['Excel']);

					expect(res.body.msg[0]).to.have.property('price', 1000);

					expect(res.body.msg[0]).to.have.property(
						'assignedTo',
						'1@testmocha.com'
					);
					expect(res.body.msg[0]).to.have.property(
						'createdBy',
						'1@testmocha.com'
					);
					expect(res.body.msg[0]).to.have.property(
						'lastUpdatedBy',
						'1@testmocha.com'
					);

					done();
				});
		});

		it('6c. Editor User logged in, person can perform an CREATE a project on private page', (done) => {
			chai
				.request(server)
				.post('/api/product/create')
				.send({
					...projectTwo,
					comments: {
						id: uuidv4(),
						comments: 'blah..',
						dte,
						createdBy: LOGINS.userOne,
					},
					assignedTo: LOGINS.userEmail,
					createdBy: LOGINS.userOne,
					lastUpdatedBy: LOGINS.userOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'New project added');
					res.status.should.equal(200);
					done();
				});
		});

		it('7. Editor User logged in, person can perform an DELETE as they have this permission', (done) => {
			chai
				.request(server)
				.delete('/api/product/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.status, 202);

					assert.equal(res.body, 'Project deleted');

					// logout user
					logOutTest(LOGINS.userOne, userPassword);
					done();
				});
		});

		it('8. No User logged in, person NOT able to view private page `/api/product`, expect view blocked', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.end((err, res) => {
					if (err) done(err);

					expect(res.status).to.equal(401);
					assert.equal(
						res.body.errors,
						'Invalid Authentication - Please log in.  from auth.js'
					);

					done();
				});
		});
	});

	describe('   Basic user person can view private pages', () => {
		accessToken = '';
		userID = '';
		it('1. Basic User logged in, person can view all projects on the private page', (done) => {
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
						expect(res.body.user).to.have.property('role', 0);
						accessToken = res.body.accesstoken;
						chai
							.request(server)
							.get('/api/product')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								assert.lengthOf(res.body.msg, 1);
								expect(res.body.msg[0]).to.have.property(
									'title',
									'Title project2...'
								);

								assert.lengthOf(res.body.msg[0].type, 2);
								assert.lengthOf(res.body.msg[0].comments, 1);

								expect(res.body.msg[0]).to.have.property('price', 100);

								done();
							});
					}
				});
		});

		it('2. Basic User logged in, person can perform an CREATE a project on private page', (done) => {
			chai
				.request(server)
				.post('/api/product/create')
				.send({
					...projectOne,
					comments: {
						id: uuidv4(),
						comments: 'blah..',
						dte,
						createdBy: LOGINS.userEmail,
					},
					assignedTo: LOGINS.userEmail,
					createdBy: LOGINS.userEmail,
					lastUpdatedBy: LOGINS.userEmail,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'New project added');
					res.status.should.equal(200);
					done();
				});
		});

		it('2b. Basic User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.lengthOf(res.body.msg, 2);
					userID = res.body.msg[1]._id;

					done();
				});
		});

		it('3. Basic User logged in, person can perform an UPDATE a project on private page', (done) => {
			chai
				.request(server)
				.put('/api/product/update/' + userID)
				.send({
					...changeProjectOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'Project updated');

					done();
				});
		});

		it('3b. Basic User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);
					expect(res.body.msg[1]).to.have.property(
						'customerID',
						'customer1@gmail.com'
					);
					expect(res.body.msg[1]).to.have.property(
						'title',
						'Title project1... CHANGED'
					);
					expect(res.body.msg[1]).to.have.property('projectCompleted', true);
					expect(res.body.msg[1]).to.have.property(
						'description',
						'Description....CHANGED'
					);

					expect(res.body.msg[1]).to.have.property('paid', true);
					expect(res.body.msg[1].payments[0]).to.have.property(
						'paidAmount',
						'5'
					);
					expect(res.body.msg[1].payments[0]).to.have.property(
						'paymentDate',
						'03/01/2023'
					);
					expect(res.body.msg[1].payments[0]).to.have.property(
						'createdBy',
						'1@testmocha.com'
					);

					expect(res.body.msg[1].comments).to.have.lengthOf(2);
					expect(res.body.msg[1].comments[0].id).to.equal(1);
					expect(res.body.msg[1].comments[0].comments).to.equal('blah..');
					expect(res.body.msg[1].comments[0].createdBy).to.equal(
						LOGINS.userOne
					);
					expect(res.body.msg[1].comments[0].dte).to.equal(
						'17/01/2023 16:52:58'
					);

					expect(res.body.msg[1].comments[1].id).to.equal(2);
					expect(res.body.msg[1].comments[1].comments).to.equal('blah..2');
					expect(res.body.msg[1].comments[1].dte).to.equal(
						'18/01/2023 17:52:58'
					);
					expect(res.body.msg[1].comments[1].createdBy).to.equal(
						LOGINS.userOne
					);

					expect(res.body.msg[1].type).to.members(['Excel']);

					expect(res.body.msg[1]).to.have.property('price', 1000);

					expect(res.body.msg[1]).to.have.property(
						'assignedTo',
						'1@testmocha.com'
					);
					expect(res.body.msg[1]).to.have.property(
						'createdBy',
						'1@testmocha.com'
					);
					expect(res.body.msg[1]).to.have.property(
						'lastUpdatedBy',
						'1@testmocha.com'
					);

					done();
				});
		});

		it('4. Basic User logged in, person can NOT perform an DELETE as they dont have this permission', (done) => {
			chai
				.request(server)
				.delete('/api/product/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.status, 403);

					assert.equal(res.body.errors, 'Access denied 2');

					// logout user
					logOutTest(LOGINS.userEmail, userPassword);
					done();
				});
		});
	});

	describe('   Admin user person can view private pages', () => {
		accessToken = '';
		userID = '';
		it('1. Admin User logged in, person can view all projects on the private page', (done) => {
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
						expect(res.body.user).to.have.property('role', 2);
						accessToken = res.body.accesstoken;
						chai
							.request(server)
							.get('/api/product')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								assert.lengthOf(res.body.msg, 2);
								expect(res.body.msg[0]).to.have.property(
									'title',
									'Title project2...'
								);

								assert.lengthOf(res.body.msg[0].type, 2);
								assert.lengthOf(res.body.msg[0].comments, 1);

								expect(res.body.msg[0]).to.have.property('price', 100);

								done();
							});
					}
				});
		});

		it('2. Admin User logged in, person can perform an CREATE a project on private page', (done) => {
			chai
				.request(server)
				.post('/api/product/create')
				.send({
					...projectOne,
					comments: {
						id: uuidv4(),
						comments: 'blah..',
						dte,
						createdBy: LOGINS.userTwo,
					},
					assignedTo: LOGINS.userTwo,
					createdBy: LOGINS.userTwo,
					lastUpdatedBy: LOGINS.userTwo,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'New project added');
					res.status.should.equal(200);
					done();
				});
		});

		it('2b. Admin User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.lengthOf(res.body.msg, 3);
					userID = res.body.msg[2]._id;

					done();
				});
		});

		it('3. Admin User logged in, person can perform an UPDATE a project on private page', (done) => {
			chai
				.request(server)
				.put('/api/product/update/' + userID)
				.send({
					...changeProjectOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'Project updated');

					done();
				});
		});

		it('3b. Admin User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);
					expect(res.body.msg[2]).to.have.property(
						'customerID',
						'customer1@gmail.com'
					);
					expect(res.body.msg[2]).to.have.property(
						'title',
						'Title project1... CHANGED'
					);
					expect(res.body.msg[2]).to.have.property('projectCompleted', true);
					expect(res.body.msg[2]).to.have.property(
						'description',
						'Description....CHANGED'
					);

					expect(res.body.msg[2]).to.have.property('paid', true);
					expect(res.body.msg[2].payments[0]).to.have.property(
						'paidAmount',
						'5'
					);
					expect(res.body.msg[2].payments[0]).to.have.property(
						'paymentDate',
						'03/01/2023'
					);
					expect(res.body.msg[2].payments[0]).to.have.property(
						'createdBy',
						'1@testmocha.com'
					);

					expect(res.body.msg[2].comments).to.have.lengthOf(2);
					expect(res.body.msg[2].comments[0].id).to.equal(1);
					expect(res.body.msg[2].comments[0].comments).to.equal('blah..');
					expect(res.body.msg[2].comments[0].createdBy).to.equal(
						LOGINS.userOne
					);
					expect(res.body.msg[2].comments[0].dte).to.equal(
						'17/01/2023 16:52:58'
					);

					expect(res.body.msg[2].comments[1].id).to.equal(2);
					expect(res.body.msg[2].comments[1].comments).to.equal('blah..2');
					expect(res.body.msg[2].comments[1].dte).to.equal(
						'18/01/2023 17:52:58'
					);
					expect(res.body.msg[2].comments[1].createdBy).to.equal(
						LOGINS.userOne
					);

					expect(res.body.msg[2].type).to.members(['Excel']);

					expect(res.body.msg[2]).to.have.property('price', 1000);

					expect(res.body.msg[2]).to.have.property(
						'assignedTo',
						'1@testmocha.com'
					);
					expect(res.body.msg[2]).to.have.property(
						'createdBy',
						'1@testmocha.com'
					);
					expect(res.body.msg[2]).to.have.property(
						'lastUpdatedBy',
						'1@testmocha.com'
					);

					done();
				});
		});

		it('4. Admin User logged in, person can perform an DELETE as they have this permission', (done) => {
			chai
				.request(server)
				.delete('/api/product/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);
					assert.equal(res.status, 202);
					assert.equal(res.body, 'Project deleted');

					// logout user
					logOutTest(LOGINS.userTwo, userPassword);
					done();
				});
		});

		it('4b. Admin User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/product')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.lengthOf(res.body.msg, 2);

					done();
				});
		});
	});
});
