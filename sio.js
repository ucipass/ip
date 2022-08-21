const sio = require("socket.io");
const http = require("./http.js")
const geolookup = require('./geolookup.js')
const log = require("./log.js")

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
        // let headers = socket.handshake.headers
        let ipaddr = socket.handshake.address
        let ipaddr2 = socket.handshake.headers['x-forwarded-for']
        log.info(ipaddr)
        log.info(ipaddr2)
        const status = {
            connections: io.sockets.sockets.size
        } 
        socket.emit("status",status);
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