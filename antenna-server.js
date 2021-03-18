const { request } = require("express");

const
Server = require("./src/server"),
Client = require("./src/client")
API = require("./src/api")

module.exports = {Server,Client,API};