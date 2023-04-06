import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
// import 'mocha';

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
