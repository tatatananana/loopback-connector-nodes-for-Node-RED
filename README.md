# Loopback connector nodes for Node-RED

Loopback is a powerful NodeJS framework to create REST APIs based on declarative 
model definitions. 

Node-RED is yet another porwerful tool to wire together APIs and online services.

This project provides a set of custom Node-RED nodes which can be used to integrate 
Node-RED with any loopback application. 

This integration greatly enhances the existing capabilities of loopback application
by allowing to observe the application in Node-RED and inject code at runtime 
without touching the original application.

## Prerequisite

It is required to run Node-RED in the loopback application. This project provides 
node-red.js module which can be used as follows in loopback application's server\boot 
script

node-red.js will start a Node-RED server when the loopback application is started.

## Installation

### Install this node module 
```
npm install node-red-contrib-loopback
```
### Start Node-RED Server from loopback application
In your loopback application simply add a new boot script with following code in it

```
var nodeRed = require("node-red-contrib-loopback");

module.exports = function(server, callback) {
    nodeRed.start({port:22081}, function() {
        callback();
    })
}
```
Node-RED server will be available to access on http://localhost:22081/red. 

You can also specify following options while starting Node-RED

```
var options = {
    port: <port number on which Node-RED server to be started>,
    settings: {
        httpAdminRoot: ...,
        httpNodeRoot: ...,
        userDir: ...,
        nodesDir: ...,
        flowFile: ...,
    }
}
// Please see default settings.js file in node_modules/node-red for other options for settings.
```

## Contributing
We welcome contributions. 