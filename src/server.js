"use strict";

const socketIo = require('socket.io'),
	http = require('http'),
	Client = require("./client"),
	API = require("./api");


class Server {
	constructor(name, port) {
		this.name = name;
		this.port = port;

		this.api = new API(this);
		this.server = http.Server(this.api.app);
		this.io = socketIo(this.server,{
			cors: {
			  origin: "https://antennatest.herokuapp.com/",
			  methods: ["GET", "POST"]
			}
		  });

		this.rooms = {};
		this.users = {};

		this.io.on('connect', this.joinServer.bind(this));
		console.log("Created Server " + this.name);

	}

	start() {
		return new Promise((resolve, reject) => {
			this.server.listen(this.port, () => {
				console.log(`Starting server on port: ${this.port}`);
				resolve();
			});
		});
	}

	joinServer(socket) {
		new Client(socket);
	}

	close() {
		return new Promise((resolve, reject) => {
			this.server.close(resolve);
		});
	}
}





module.exports = Server;