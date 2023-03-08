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

const Customer = require('../models/customer');
let accessToken = '';
let userID = '';

let {
	customerOne,
	customerTwo,
	customerThree,
} = require('./__testUtils__/projects');

chai.use(chaiHttp);

describe('* Customer private view pages *', () => {
	describe('   Editor user person can view private pages', () => {
		//reset
		before((done) => {
			Customer.deleteMany({}, function (err) {});
			done();
		});

		it('1. Editor User logged in, person can view all customers on the private page', (done) => {
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
						user = res.body.user;

						chai
							.request(server)
							.get('/api/customer')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);
								res.body.msg.should.equal('No customers found');
								res.status.should.equal(400);

								done();
							});
					}
				});
		});

		it('2. Editor User logged in, person can perform an CREATE a customer on private page', (done) => {
			chai
				.request(server)
				.post('/api/customer/create')
				.send({
					...customerOne,
					createdBy: LOGINS.userOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'New customer added');
					res.status.should.equal(200);
					done();
				});
		});

		it('2b. Editor User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/customer')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);
					expect(res.body.msg[0]).to.include.keys(
						'_id',
						'name',
						'businessName',
						'email',
						'telephone',
						'address',
						'createdBy',
						'createdAt',
						'updatedAt'
					);
					expect(res.body.msg[0]).to.have.property('name', 'cust1');
					expect(res.body.msg[0]).to.have.property('businessName', 'bus1');
					expect(res.body.msg[0]).to.have.property(
						'email',
						'customer1@gmail.com'
					);

					userID = res.body.msg[0]._id;

					done();
				});
		});

		it('3. Editor User logged in, person can NOT perform an CREATE a customer if customer already exists', (done) => {
			chai
				.request(server)
				.post('/api/customer/create')
				.send({
					...customerOne,
					createdBy: LOGINS.userOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.errors, 'Account already exists');
					res.status.should.equal(409);
					done();
				});
		});

		it('4. Any user logged in can NOT perform an CREATE on private page if no `accessToken` included in headers', (done) => {
			chai
				.request(server)
				.post('/api/customer/create')
				.send({
					...customerTwo,
					createdBy: LOGINS.userOne,
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

		it('5. Any user logged can NOT perform an UPDATE if not all required fields are supplied', (done) => {
			chai
				.request(server)
				.post('/api/customer/create')
				.send({
					name: 'nochance',
					businessName: 'nochance',
					email: 'nochance',
					createdBy: LOGINS.userOne,
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

		it('6. Editor User logged in, person can perform an UPDATE a customer on private page', (done) => {
			chai
				.request(server)
				.put('/api/customer/update/' + userID)
				.send({
					...customerOne,
					name: 'newnameforCustomer1',
					createdBy: LOGINS.userOne,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'Customer updated');

					done();
				});
		});

		it('6b. Editor User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/customer')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);

					expect(res.body.msg[0]).to.have.property(
						'name',
						'newnameforCustomer1'
					);

					done();
				});
		});

		it('7. Editor User logged in, person can NOT perform an DELETE as they dont have this permission', (done) => {
			chai
				.request(server)
				.delete('/api/customer/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.errors, 'Access denied 2');
					assert.equal(res.status, '403');
					// logout user
					logOutTest(LOGINS.userOne, userPassword);
					done();
				});
		});

		it('8. No User logged in, person NOT able to view private page `/api/customer`, expect view blocked', (done) => {
			chai
				.request(server)
				.get('/api/customer')
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
		//reset
		before((done) => {
			Customer.deleteOne({ name: 'cust2' }, function (err) {});
			done();
		});

		it('1. Basic User logged in, person can view all customers on the private page', (done) => {
			//reset
			accessToken = '';
			userID = '';
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
						// user = res.body.user;

						chai
							.request(server)
							.get('/api/customer')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								assert.lengthOf(res.body.msg, 1);
								res.status.should.equal(200);

								done();
							});
					}
				});
		});

		it('2. Basic User logged in, person can perform an CREATE a customer on private page', (done) => {
			chai
				.request(server)
				.post('/api/customer/create')
				.send({
					...customerTwo,
					createdBy: LOGINS.userEmail,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'New customer added');
					res.status.should.equal(200);
					done();
				});
		});

		it('2b. Basic User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/customer')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);
					expect(res.body.msg[0]).to.include.keys(
						'_id',
						'name',
						'businessName',
						'email',
						'telephone',
						'address',
						'createdBy',
						'createdAt',
						'updatedAt'
					);
					assert.equal(res.status, 200);
					// two customers now
					assert.lengthOf(res.body.msg, 2);

					assert.propertyVal(res.body.msg[0], 'name', 'newnameforCustomer1');
					assert.propertyVal(res.body.msg[0], 'businessName', 'bus1');
					assert.propertyVal(res.body.msg[0], 'email', 'customer1@gmail.com');

					expect(res.body.msg[1]).to.have.property('name', 'cust2');
					expect(res.body.msg[1]).to.have.property('businessName', 'bus2');
					expect(res.body.msg[1]).to.have.property(
						'email',
						'customer2@gmail.com'
					);
					assert.propertyVal(
						res.body.msg[1].address,
						'addressLine1',
						'2 street road'
					);
					assert.propertyVal(res.body.msg[1].address, 'town', 'Erith');
					assert.propertyVal(res.body.msg[1].address, 'postcode', 'DA2');

					userID = res.body.msg[1]._id;

					done();
				});
		});

		it('3. Editor User logged in, person can perform an UPDATE a customer on private page', (done) => {
			chai
				.request(server)
				.put('/api/customer/update/' + userID)
				.send({
					...customerTwo,
					name: 'newnameforCustomer2',
					createdBy: LOGINS.userEmail,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'Customer updated');

					done();
				});
		});

		it('3b. Editor User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/customer')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);
					res.status.should.equal(200);

					expect(res.body.msg[1]).to.have.property(
						'name',
						'newnameforCustomer2'
					);

					done();
				});
		});

		it('4. Editor User logged in, person can NOT perform an DELETE as they dont have this permission', (done) => {
			chai
				.request(server)
				.delete('/api/customer/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.errors, 'Access denied 2');
					assert.equal(res.status, '403');
					// logout user
					logOutTest(LOGINS.userEmail, userPassword);
					done();
				});
		});
	});

	describe('   Admin user person can view private pages', () => {
		//reset
		before((done) => {
			Customer.deleteOne({ name: 'cust3' }, function (err) {});
			done();
		});

		it('1. Admin User logged in, person can view all customers on the private page', (done) => {
			//reset
			accessToken = '';
			userID = '';
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
						// user = res.body.user;

						chai
							.request(server)
							.get('/api/customer')
							.set('content-type', 'application/json')
							.set('Authorization', `Bearer ${accessToken}`)
							.end((err, res) => {
								if (err) done(err);

								assert.lengthOf(res.body.msg, 2);
								res.status.should.equal(200);

								done();
							});
					}
				});
		});

		it('2. Admin User logged in, person can perform an CREATE a customer on private page', (done) => {
			chai
				.request(server)
				.post('/api/customer/create')
				.send({
					...customerThree,
					createdBy: LOGINS.userTwo,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'New customer added');
					res.status.should.equal(200);
					done();
				});
		});

		it('2b. Admin User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/customer')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					res.status.should.equal(200);
					expect(res.body.msg[0]).to.include.keys(
						'_id',
						'name',
						'businessName',
						'email',
						'telephone',
						'address',
						'createdBy',
						'createdAt',
						'updatedAt'
					);
					assert.equal(res.status, 200);
					// three customers now
					assert.lengthOf(res.body.msg, 3);
					assert.propertyVal(res.body.msg[2], 'name', 'cust3');
					assert.propertyVal(res.body.msg[2], 'businessName', 'bus3');
					assert.propertyVal(res.body.msg[2], 'email', 'customer3@gmail.com');
					assert.propertyVal(res.body.msg[2].address, 'town', 'Erith');
					assert.propertyVal(res.body.msg[2].address, 'postcode', 'DA2');

					userID = res.body.msg[2]._id;

					done();
				});
		});

		it('3. Admin User logged in, person can perform an UPDATE a customer on private page', (done) => {
			chai
				.request(server)
				.put('/api/customer/update/' + userID)
				.send({
					...customerThree,
					name: 'newnameforCustomer3',
					createdBy: LOGINS.userTwo,
				})
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'Customer updated');

					done();
				});
		});

		it('3b. Admin User logged in, person can see that the previous update changes are visable', (done) => {
			chai
				.request(server)
				.get('/api/customer')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);
					res.status.should.equal(200);

					expect(res.body.msg[2]).to.have.property(
						'name',
						'newnameforCustomer3'
					);

					done();
				});
		});

		it('4. Admin User logged in, person can perform an DELETE as they have this permission', (done) => {
			chai
				.request(server)
				.delete('/api/customer/delete/' + userID)
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.end((err, res) => {
					if (err) done(err);

					assert.equal(res.body.msg, 'Customer deleted');
					// logout user
					logOutTest(LOGINS.userTwo, userPassword);
					done();
				});
		});
	});
});
