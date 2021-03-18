const API = require("./api"),
    http = require("http");

const genNum = _ => Math.round(Math.random() * 65535),
    name = "test_" + genNum(),
    address = "localhost",
    port = genNum();
serverInfo = { name, port; };

let server, api;

beforeAll(done => {
    api = new API(serverInfo);
    server = http.Server(api.app);

    server.listen(serverInfo.port, () => {
        done();
    });
});

afterAll(done => {
    server.close();
    done();
});

describe('antenna server api testing', () => {
    test("server info", done => {
        done();
    });
});