"use strict";

const webServer = require("tn-webserver"),
	socketIo = require("socket.io"),
	express = require('express');

function createBinder(instance) {
	return (function (a, ...p) {
		return this[a].bind(this, ...p);
	}).bind(instance);
}

class Server {
	constructor(port) {
		this.name = process.env.ANTENNA_NAME||"Untitled Antenna Server"
		this.port = port;

		this.api = new API(this);
		this.server = this.api.server;
		this.io = socketIo(server);

		this.rooms = {};
		this.users = {};

		this.io.on('connect',this.joinServer.bind(this));
		console.log("Created Server " + this.name);

	}

	joinServer(socket) {
		new Client(socket);
	}
}

class API {
	constructor(server) {
		this.app = express();
		this.server = webServer(this.app, {}, server.port);
		this.app.set('port',server.port);
		
		this.get("/",this.getServerInfo.bind(this));
		
		console.log("Setup API");
	}
	
	get(path,action) {
		this.app.get(path,(req,res)=>res.json(action(req.params)));
	}
	
	getServerInfo(p) {
		return {
			name:server.name,
			port: server.port
		};
	}
}

class Client {
	constructor(socket) {
		this.bind = createBinder(this);
		this.socket = socket;

		this.emit("connect");
		this.bindSocket("disconnect");
		this.bindSocket("login");
		this.bindSocket("joinRoom");
		this.bindSocket("request");
		this.bindSocket("answer");
		this.bindSocket("candidate");
		this.bindSocket("status");
		console.debug("Client Connected:", this.id);
	}

	get id() {
		return this.socket.id;
	}
	bindSocket(name) {
		let t = this;
		this.socket.on(name, (...p) => {
			console.log(t.id, name, ...p);
			this.bind(name)(...p);
		});
	}
	join(room) {
		if (this.room) {
			console.log(`${this.id} is leaving room ${this.room}`);
			this.socket.leave(this.room);
		}
		this.room = room || "test";
		console.log(`${this.id} is joining room ${this.room}`);
		this.socket.join(this.room);
	}
	emit(...a) {
		this.socket.emit(...a);
	}

	peerEmit(peer, ...a) {
		this.socket.to(peer).emit(...a);
	}

	roomEmit(...a) {
		this.peerEmit(this.room, ...a);
	}

	disconnect() {
		console.debug("Client Disconnected:", this.id);
		this.roomEmit("peerDisconnect", this.id);
	}
	joinRoom(room) {
		if (this.room)
			this.roomEmit("peerDisconnect", this.id);
		this.join(room);
		this.roomEmit("peerConnect", { id: this.id });
	}

	status(status) {
		this.roomEmit("status", { id: this.id, status });
	}

	request({ id, description }) {
		this.peerEmit(id, "request", { id: this.id, description });
	}

	answer({ id, description }) {
		this.peerEmit(id, "answer", { id: this.id, description });
	}

	candidate({ id, candidate }) {
		this.peerEmit(id, "candidate", { id: this.id, candidate });
	}
}

var server;
module.exports = function (port) {
	server = new Server(port);
}