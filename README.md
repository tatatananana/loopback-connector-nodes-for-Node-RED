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
This is how you install...
## Contributing