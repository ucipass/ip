const net = require('net')
const log = require('./log.js')
const geolookup = require('./geolookup.js')
const TELNET_PORT = process.env.TELNET_PORT || "2323"
const sio = require("./sio.js")
const { isObject } = require('@vue/shared')

const server = net.createServer( async (tcp) => {
    let ipaddr = tcp.remoteAddress
    tcp.on("close",(err)=>{
        log.debug(`tcp connection closed for ${ipaddr}!`)  
    })
    tcp.on("data", (data) =>{
        log.debug(`tcp data received from ${ipaddr}!`)  
    })
    tcp.on("drain", () =>{
        log.debug(`tcp write buffer becomes empty for ${ipaddr}!`)  
    })
    tcp.on("error", (err) =>{
        log.debug(`tcp error occured for ${ipaddr}!`)  
        // log.error(err)  
    })
    tcp.on("ready", () =>{
        log.debug(`tcp socket is ready for ${ipaddr}!`)  
    })
    tcp.on("timeout", () =>{
        log.debug(`tcp timeout occured for ${ipaddr}!`)  
    })

    let output = await geolookup(ipaddr,"Telnet Client")
    output_string = JSON.stringify(output, null, 2)
    try {
        tcp.write(output_string)
        tcp.end()
        const io = await sio
        io.of("/").emit("telnet",output)

    } catch (error) {
        log.error(`Exception for: ${ipaddr}`)
        log.debug(output)
    }

})

server.maxConnections = 10
server.listen(TELNET_PORT, '0.0.0.0',()=> { 
    log.info(`Telnet server started on port ${TELNET_PORT}!`)  
})
server.on('close', (err) => {
    log.error("Telnet closed with all connections ended!")
});
server.on('error', (err) => {
    log.error("Telnet Server Error!")
    log.debug(err)
});


module.exports = server