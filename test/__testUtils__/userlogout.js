const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const { assert } = require('chai');

const logOutTest = (e, pw) => {
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

module.exports = logOutTest;
