const sio = require("socket.io");
const http = require("./http.js")
const geolookup = require('./geolookup.js')
const log = require("./log.js")
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const server_start = dayjs()
const max_client_minutes = 60

function customSocketIO(server) {
    const options = {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"]
        }
    }

    const maxHistory = 5

    const io = sio(server, options)
    io.history = []
    for (let index = 0; index < maxHistory; index++) {
        io.history.push(null) 
    }
    io.send = async function(channel, message){
        message.timeStamp = (new Date()).toLocaleTimeString()
        await server
        io.history.shift()
        io.history.push({
            channel: channel,
            message: message
        })
        io.of("/").emit(channel,message)   
    }
    io.on("connection", async (socket)=>{
        // let headers = socket.handshake.headers
        let ipaddr = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address
        const status = {
            server_start: server_start.from(dayjs())
        } 
        
        socket.geo = await geolookup(ipaddr,"HTTP Client")
        socket.emit("http",socket.geo);
        socket.socket_start = dayjs()

        socket.on("status", ( data, fn )=> {
            status.connections = []
            io.sockets.sockets.forEach( socket => {
                let con = {
                    // id : socket.id,
                    // headers: socket.handshake.headers,
                    geo: socket.geo,
                    start_time: socket.socket_start.from(dayjs())  
                }
                status.connections.push(con)
            });

            fn( status )
        })

        socket.on("history", ( data, fn )=> {
            fn( io.history )
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

    setInterval(() => {
        cur_time = dayjs()
        max_time = max_client_minutes * 60 * 1000
        io.sockets.sockets.forEach( socket => {
            let dur = cur_time.diff(socket.socket_start)
            if (dur > max_time) {
                socket.disconnect()
            }
        });
    }, 10000);
    return io
}

// Exports Socket.io instance
module.exports = http
.then( customSocketIO )
.catch(error => {
    console.log( "SOCKET.IO ERROR", error)
})