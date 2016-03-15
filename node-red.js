/**
 * 
 * ©2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 * The EdgeVerve proprietary software program ("Program"), is protected by
 * copyrights laws, international treaties and other pending or existing
 * intellectual property rights in India, the United States and other countries.
 * The Program may contain / reference third party or open source components,
 * the rights to which continue to remain with the applicable third party
 * licensors or the open source community as the case may be and nothing here
 * transfers the rights to the third party and open source components, except as
 * expressly permitted. Any unauthorized reproduction, storage, transmission in
 * any form or by any means (including without limitation to electronic,
 * mechanical, printing, photocopying, recording or otherwise), or any
 * distribution of this Program, or any portion of it, may result in severe
 * civil and criminal penalties, and will be prosecuted to the maximum extent
 * possible under the law.
 * 
 * 
 */

var http = require('http');
var express = require('express');

var RED = require('node-red');

module.exports = {
    start : start,
    stop : stop
}

function start(options, callback) {

    // Create an Express app
    var app = express();

    // Add a simple route for static content served from 'public'
    app.use('/', express.static('public'));

    // Create a server
    var server = http.createServer(app); // jshint ignore:line

    // Create the settings object - see default settings.js file for other
    // options
    var settings;
    if (options && options.settings) {
	settings = options.settings;
    } else {
	settings = {
	    httpAdminRoot : '/red',
	    httpNodeRoot : '/redapi',
	    userDir : 'nodered/',
	    nodesDir : '../nodes',
	    flowFile : 'node-red-flows.json',
	    functionGlobalContext : {}
	// enables global context
	};
    }

    // Initialise the runtime with a server and settings
    RED.init(server, settings);

    // Serve the editor UI from /red
    app.use(settings.httpAdminRoot, RED.httpAdmin);

    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot, RED.httpNode);

    var port = options ? options.port || 3001 : 3001;

    server.listen(port);

    // Start the runtime
    RED.start();

    setTimeout(callback(), 5000);
}

function stop() {
    RED.stop();
}
