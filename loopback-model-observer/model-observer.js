var loopback = require('loopback');
var _ = require('lodash');

module.exports = function(RED) {

    function ModelObserverNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var modelName = config.modelname;
        var event = config.event;

        var Model = loopback.findModel(modelName);

        node.enabled = true;
        if (Model !== undefined) {

            Model.on(event, function(eventPayload) {
                if (node.enabled) {
                    var msg = {
                        payload : eventPayload
                    }

                    node.send(msg);
                } else {
                    console.log('node is disabled............');
                }
            })
        }

        node.on('close', function() {
            node.enabled = false;
        });
    }

    RED.nodes.registerType("model-observer", ModelObserverNode);
}
