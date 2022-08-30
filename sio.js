const sio = require("socket.io");
const http = require("./http.js")
const geolookup = require('./geolookup.js')
const log = require("./log.js")
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const server_start = dayjs()
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
        let ipaddr = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address
        const status = {
            server_start: server_start.from(dayjs())
        } 
        
        socket.geo = await geolookup(ipaddr,"HTTP Client")
        socket.emit("http",socket.geo);

        socket.on("status", ( data, fn )=> {
            status.connections = []
            io.sockets.sockets.forEach( socket => {
                let con = {
                    // id : socket.id,
                    // headers: socket.handshake.headers,
                    geo: socket.geo
                }
                status.connections.push(con)
            });

            fn( status )
        })

        socket.on('disconnect', (data)=>{
            status.connections = []
            io.sockets.sockets.forEach( socket => {
                let con = {
                    // id : socket.id,
                    // headers: socket.handshake.headers,
                    geo: socket.geo
                }
                status.connections.push(con)
            });
        })        

    })    
    return io
})
.catch(error => {
    console.log( "SOCKET.IO ERROR", error)
})