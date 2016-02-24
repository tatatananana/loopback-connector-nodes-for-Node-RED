var supertest = require('supertest');
var nodered = require('../node-red');

describe('Node-RED startup', function() {

    before('before all tests', function(done) {
	done();
    })

    it('should start node-red on default port with default settings', function(done) {
	this.timeout(6000);
	var nodeRedApi = supertest('http://localhost:3001/red/');

	nodered.start({}, function() {
	    console.log('node-red started');

	    nodeRedApi.get('/').expect(200).end(function(err, res) {
		if (err) {
		    throw err
		}

		done();

	    });
	});
    })

    it('should start node-red on specified port with default settings', function(done) {
	this.timeout(6000);
	var nodeRedApi = supertest('http://localhost:3002/red/');

	nodered.start({
	    port : 3002
	}, function() {
	    console.log('node-red started');

	    nodeRedApi.get('/').expect(200).end(function(err, res) {
		if (err) {
		    throw err
		}

		done();

	    });
	});
    })

    afterEach('stop node-red', function(done) {
	nodered.stop();
	done();
    })

});