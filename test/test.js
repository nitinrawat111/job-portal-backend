import app from '../src/server.js';
import supertest from 'supertest';

describe("GET /", function () {
	it("it should has status code 404", function (done) {
		supertest(app)
			.get("/")
			.expect(404)
			.end(function (err, res) {
				if (err) done(err);
				done();
			});
	});
});

