let Server = require("./server"),
    io = require("socket.io-client");

let genNum = _ => Math.round(Math.random() * 65535),

    name = "test_" + genNum();
address = "localhost",
    port = genNum();

console.log("Generated test params\n" + JSON.stringify({ name, address, port }, null, 2));

let server, clientA, clientB, room;

function connectClient() {
    return new Promise((resolve, reject) => {
        let socket = io.connect(`http://${address}:${port}`);
        socket.on('connect', () => {
            resolve(socket);
        });

    });
}
function disconnectClient(socket) {
    if (socket.connected) {
        socket.disconnect();
    }
}

beforeAll(done => {
    server = new Server(name, port);
    server.start().then(done);
    room = "room_" + genNum();
    status = "status_" + genNum();
});

afterAll(async done => {
    await server.close();
    done();
});

beforeEach(async done => {
    clientA = await connectClient();
    clientB = await connectClient();
    done();
});

afterEach(done => {
    disconnectClient(clientA);
    disconnectClient(clientB);
    done();
});

describe('antenna server testing', () => {
    test("peer connecting", done => {
        clientA.on("joinRoom", room => {
            expect(room).toBeDefined();
        });
        clientA.emit("joinRoom", "room_" + genNum());
        clientB.emit("joinRoom", room);
        clientB.on("peerConnect", peer => {
            expect(peer.id).toBeDefined();
            done();
        });
        clientA.emit("joinRoom", room);
    });
    test("status testing", done => {
        clientB.emit("joinRoom", room);
        clientA.emit("joinRoom", room);

        clientB.on("status", peerStatus => {
            expect(peerStatus.status).toBeDefined();
            done();
        });

        clientA.emit("status", status);

    });
});