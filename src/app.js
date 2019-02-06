/**
 * Created by bbedsaul on 8/1/16.
 */
var hl7    = require('simple-hl7');
var server = hl7.Server;
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

var tcpServer  = server.createTcpServer();

tcpServer.on('msg', function(msg) {
  //msg is a Message object from "simple-hl7". see simple-hl7 on npm/github for API

  //do something with message

  //ACKs handled automatically, so don't worry about them.
  //API for custom ACKS coming in the future
  console.log(msg.toString());
});


exports.listen = function(port, server) {

  tcpServer.start(port, server);
  console.log("listening on host " + server);
  console.log("listening on port " + port);

/*
  if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log('worker %d died (%s). restarting...',
        worker.process.pid, signal || code);
      cluster.fork();
    });
  } else {
    tcpServer.start(port) //port number
    console.log("listening on port" + port);:w

  }
 */
};

