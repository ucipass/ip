const net = require('net')
const log = require('./log.js')
const geolookup = require('./geolookup.js')
const TELNET_PORT = process.env.TELNET_PORT || "2323"

const server = net.createServer( async (tcp) => {
    let ipaddr = tcp.remoteAddress
    tcp.on("close",(err)=>{
        log.info(`tcp connection closed for ${ipaddr}!`)  
    })
    tcp.on("data", (data) =>{
        log.info(`tcp data received from ${ipaddr}!`)  
    })
    tcp.on("drain", () =>{
        log.info(`tcp write buffer becomes empty for ${ipaddr}!`)  
    })
    tcp.on("error", (err) =>{
        log.info(`tcp error occured for ${ipaddr}!`)  
    })
    tcp.on("ready", () =>{
        log.info(`tcp socket is ready for ${ipaddr}!`)  
    })
    tcp.on("timeout", () =>{
        log.info(`tcp timeout occured for ${ipaddr}!`)  
    })

    let output = await geolookup(ipaddr,"Telnet Client")
    try {
        tcp.write(output)
        tcp.end()
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