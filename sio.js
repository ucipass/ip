const sio = require("socket.io");
const http = require("./http.js")

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
    io.on("connection", (socket)=>{
        socket.emit("hello","world");
        socket.on("howdy", (arg)=>{
            console.log(arg)
        })
    })
    return io
})
.catch(error => {
    console.log( "SOCKET.IO ERROR", error)
})