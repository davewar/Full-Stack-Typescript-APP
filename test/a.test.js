const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { assert, use } = require('chai');

chai.use(chaiHttp);

describe.skip('A test to check Mocka is working', () => {
	// describe.only('test mocka working', () => {
	it('test', (done) => {
		chai
			.request(server)
			.get('/test')
			.end((err, res) => {
				if (err) done(err);

				assert.equal(res.body.message, 'Welcome');
				assert.isObject(res.body);
				assert.equal(res.status, 200);

				done();
			});
	});
});
