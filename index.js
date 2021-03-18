"use strict";
const {Server} = require("./antenna-server.js"),
name = process.env.ANTENNA_NAME||"Untitled Antenna Server",
port = process.env.PORT || 3001;

let server = new Server(name,port);

server.start();