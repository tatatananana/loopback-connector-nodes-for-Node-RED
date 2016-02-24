module.exports = function (RED) {

    function NpmLoaderNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var moduleName = config.modulename;
        var modulePath = config.modulepath;

		var module = require (modulePath);

        node.on ('input', function (msg){
			
			msg [moduleName] = module;
			node.send (msg);
		});
		
        node.on('close', function () {
            
        });
    }
	
    RED.nodes.registerType("npm-loader", NpmLoaderNode);
}
