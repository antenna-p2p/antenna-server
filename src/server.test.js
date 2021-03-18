let Server = require("./server"),
io = require("socket.io-client")

let genNum = _ => Math.round(Math.random() * 65535);

let name = "test_" + genNum();
let address = "localhost";
let port = genNum();
let room = "room_" + genNum();

console.log("Generated test params\n"+JSON.stringify({name,address,port,room},null,2))

let server, clientA, clientB;

function connectClient() {
    return new Promise((resolve,reject)=>{
    let socket = io.connect(`http://${address}:${port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
    });
    socket.on('connect', () => {
        resolve(socket);
    });
        
    })
}
function disconnectClient(socket) {
    if (socket.connected) {
        socket.disconnect();
    }
}

beforeAll(done => {
    server = new Server(name, port);
    server.start().then(done);
});

afterAll(done => {
    server.close();
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
        clientB.emit("joinRoom",room);
        clientB.on("peerConnect", peer => {
            done();
        });
        clientA.emit("joinRoom",room);
    });
});