const API = require("./api"),
    http = require("http"),
    bent = require("bent"),
    getJson = bent('json');

const genNum = _ => Math.round(Math.random() * 65535),
    name = "test_" + genNum(),
    address = "localhost",
    port = genNum();
serverInfo = { name, port };

let server, api;

beforeAll(done => {
    api = new API(serverInfo);
    server = http.Server(api.app);

    server.listen(serverInfo.port, () => {
        console.log("CI Web server strated on port " + serverInfo.port);
        done();
    });
});

afterAll(done => {
    server.close(done);
});

describe('antenna server api testing', () => {
    test("server info", async done => {
        let url = `http://${address}:${port}`;
        let requestResonse = await getJson(url);
        console.log(requestResonse);

        expect(requestResonse).toBeDefined();
        expect(requestResonse.name).toBe(serverInfo.name);
        done();
    });
});