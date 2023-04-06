import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import LOGINS from './__testUtils__/logins';
import 'dotenv/config';

let userPassword = process.env.userpassword as string;
let accessToken: string = '';
let rToken: string = '';

chai.use(chaiHttp);

describe('* Login *', () => {
	describe('   Login user', () => {
		it('1. Basic User able to login with valid details', (done) => {
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
					expect(res.body.msg.accesstoken).to.be.a('string');
					expect(res.body.msg.user).to.be.a('object');
					expect(res.body.msg.user).to.have.property('id');
					expect(res.body.msg.user).to.have.property('name');
					expect(res.body.msg.user).to.have.property('role');

					let userAccessToken = res.body.msg.accesstoken;
					assert.isString(userAccessToken);

					expect(res.body.msg.user).to.have.property('role');
					let rt = res.header['set-cookie'];

					expect(Object.keys(res.header)).to.contain('set-cookie');

					// ('refreshtoken=eyJhbG...; Max-Age=86400; Path=/user/refresh_token; Expires=Mon, 23 Jan 2023 11:41:36 GMT; HttpOnly');
					expect(rt).to.be.a('Array');
					let userRefreshToken = rt[0].split(';')[0].split('refreshtoken=')[1];
					assert.typeOf(userRefreshToken, 'string');

					rToken = userRefreshToken;

					accessToken = res.body.msg.accessToken;

					done();
				});
		});

		it('1b. Basic User able to login with valid details - USER Persist: if cookie valid provide new accessToken (useRefreshToken hook)', (done) => {
			const cValue = 'refreshtoken=' + rToken;

			chai
				.request(server)
				.get('/user/refresh_token')
				.set('Cookie', cValue)
				.set('content-type', 'application/json')

				.end((err, res) => {
					if (err) done(err);

					expect(res.body.accesstoken).to.be.a('string');

					accessToken = res.body.accesstoken;
					done();
				});
		});

		it('2. Basic User able to log out', (done) => {
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

					accessToken = '';

					done();
				});
		});

		it('3. Basic user trys to login but with an incorrect password, expect error message', (done) => {
			chai
				.request(server)
				.post('/user/login')
				.send({
					email: LOGINS.userEmail,
					password: '11111111',
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					expect(res.body).to.be.a('object');

					//too many incorrect login trys
					if (res.body.message) {
						expect(res.body.message).to.be.equal(
							'Too many login attempts. Please try again after a 60 second pause'
						);
					} else {
						expect(res.body).to.have.property('errors');
						expect(res.body.errors).to.be.equal(
							'Incorrect login. Please try again'
						);
					}

					done();
				});
		});
		it('4. Basic user trys to Login but missing field supplied, expect error message', (done) => {
			chai
				.request(server)
				.post('/user/login')
				.send({
					email: 'nouserexists@gmail.com',
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					expect(res.body).to.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors).to.be.equal(
						'Incorrect login. Please try again'
					);

					done();
				});
		});

		it('5. Attempted login where no user exists, expect error message', (done) => {
			chai
				.request(server)
				.post('/user/login')
				.send({
					email: 'nouserexists@gmail.com',
					password: '123456',
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					expect(res.body).to.be.a('object');
					res.body.should.have.property('errors');
					expect(res.body.errors).to.be.equal(
						'Incorrect login. Please try again'
					);

					done();
				});
		});
	});
});
