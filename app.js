#!/usr/bin/env node
"use strict";

//module dependencies.
var app = require("../app");
var debug = require("debug")("express:server");
var http = require("http");

//get port from environment and store in Express.
var port = normalizePort(process.env.PORT || 8080);
app.set("port", port);

//create http server
var server = http.createServer(app);

//listen on provided ports
server.listen(port);

//add error handler
server.on("error", onError);

//start listening on port
server.on("listening", onListening);