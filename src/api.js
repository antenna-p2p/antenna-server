const express = require('express');

class API {
	constructor(server) {
		this.server = server;
		this.app = express();
		this.app.set('port',server.port);
		
		this.get("/",this.getServerInfo.bind(this));
		
		console.log("Setup API");
	}

	get(path,action) {
		this.app.get(path,(req,res)=>res.json(action(req.params)));
	}
	
	getServerInfo(p) {
		return {
			name: this.server.name,
			port: this.server.port
		};
	}
}

module.exports = API;