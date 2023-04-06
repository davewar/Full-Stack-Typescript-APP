import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
// const { assert } = require('chai');

const logOutTest = (e: any, pw: any): void => {
	describe('', () => {
		it('User logged out*', (done) => {
			chai
				.request(server)
				.get('/user/logout')
				.send({
					email: e,
					password: pw,
				})
				.set('content-type', 'application/json')
				.end((err, res) => {
					if (err) done(err);

					done();
				});
		});
	});
};

export default logOutTest;
