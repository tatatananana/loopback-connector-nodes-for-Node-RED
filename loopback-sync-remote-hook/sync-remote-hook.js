/**
*
*
*/
var loopback = require('loopback');
var _ = require('lodash');
var LoopBackContext = require('loopback-context');

module.exports = function(RED) {

  function removeOldObservers(Model, modelName, method,remoteName,id) {

    if (Model.app.remotes().listenerTree === undefined)
      return;


    var hooks;
    if(method=='afterRemote')
      hooks = Model.app.remotes().listenerTree.after[modelName];
    else
      hooks = Model.app.remotes().listenerTree.before[modelName];


    if (hooks !== undefined) {

      for ( var hook in hooks) {
        //console.log(method+" testing? ",hook,hooks,hooks[hook]._listeners);
        var nodeId;

        // hack to get nodeId.
        try {
          var dummyCtx = {result:null};
          nodeId = hooks[hook]._listeners(dummyCtx,null)();
          //console.log('node id received from observer = ', nodeId);
          if (nodeId === id) {
            // Id matched. remove this observer
            // console.log('node id matched. removing this
            // observer.');
            delete hooks[hook]._listeners;

            //console.log("match node id",id);
          }
        } catch (e) {
          //console.log(e);
        }
      }
    }


  }

  function SyncObserverNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    var modelName = config.modelname;
    var remoteName = config.remotename;
    var method = config.method;

    var Model = loopback.findModel(modelName);

    if (Model !== undefined) {
      // console.log ('Model = ', Model._observers[method][0]);

      // Remove existing observers if any.
      // console.log('observers before removing = ', Model._observers);
      removeOldObservers(Model,modelName, method,remoteName,node.id);
      // console.log('observers after removing = ', Model._observers);

      //Model.observe(method, new hook(node, modelName, method,remoteName).observe);
      var fn = new hook(node, modelName, method,remoteName).observe;
      Model[method](remoteName,fn);
    }

    node.on('close', function() {
      // console.log('node is closing. removing observers')
      if (Model != undefined) {
        // console.log('observers before removing = ',
        // Model._observers);
        removeOldObservers(Model,modelName, method,remoteName,node.id);
        // console.log('observers after removing = ', Model._observers);
      }
    });
  }
  RED.nodes.registerType("sync-remote-hook", SyncObserverNode);
}

var hook = function(node, modelName, methodName,remoteName) {
  var _node = node;
  var _modelName = modelName;
  var _methodName = methodName;
  var _remoteName = remoteName;



  this.observe = function(ctx, instanceOrNext,next) {
    if(typeof instanceOrNext=="function") {
      //Instance methods and static built-in methods, instanceOrNext is the instance
      next = instanceOrNext;
    }

    var id = _node.id;

    // sort of an hack to return a function in case this method is called by
    // node itself.
    if (ctx.result === null && next == null) {
      //console.log("hack detected");
      var getNRId = function() {
        return id;
      };

      return getNRId;
    }

    var msg = {};
    if(_methodName=='afterRemote')
    msg.result = ctx.result;

    msg.args = ctx.args;
    msg.req = ctx.req;

    if (ctx.Model !== undefined) {
      msg.payload = ctx.Model.definition.name + '.' + _methodName + ' triggered';
    } else {
      msg.payload = _modelName + '.' + _methodName + ' triggered';
    }


    //msg.ctx = JSON.parse(JSON.stringify(ctx));
    //http://loopback.io/doc/en/lb3/Using-current-context.html
    msg.ctx = LoopBackContext.getCurrentContext();

    msg.next = function(msg) {
      // var updatedCtx = msg.ctx;
      //var updatedCtx = JSON.parse(JSON.stringify(msg.ctx));
      //console.log("updatedCtx!!!!!!!",updatedCtx);
      // console.log('callback function called. returning to loopback.
      // updatedCtx =', updatedCtx);

      // if (updatedCtx.query !== undefined) {
      //     // ctx.query = updatedCtx.query;
      //     _.assign(ctx.query, updatedCtx.query);
      // }
      //
      // if (updatedCtx.instance !== undefined) {
      //
      //     _.assign(ctx.instance, updatedCtx.instance);
      //     // console.log('new instance = ', ctx.instance);
      // }
      //
      // if (updatedCtx.data !== undefined) {
      //     _.assign(ctx.data, updatedCtx.data);
      // }
      _.assign(ctx.args, msg.args);

      if(_methodName=='afterRemote')
        ctx.result = msg.result;

      next();

    }

    _node.send(msg);
  }
}
