const sio = require("socket.io");
const http = require("./http.js")
const geolookup = require('./geolookup.js')

// Exports Socket.io instance
module.exports = http
.then( server => {
    const options = {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"]
        }
    }
    const io = sio(server, options)
    io.on("connection", async (socket)=>{
        let headers = socket.handshake.headers
        let ipaddr = socket.handshake.address
        let output = await geolookup(ipaddr,"HTTP Client")
        connection = JSON.stringify(socket.handshake)
        socket.emit("http",output);
        socket.on("howdy", (arg)=>{
            console.log(arg)
        })
    })
    return io
})
.catch(error => {
    console.log( "SOCKET.IO ERROR", error)
})