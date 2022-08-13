const net = require('net')
const log = require('./log.js')
const geolookup = require('./geolookup.js')
const TELNET_PORT = process.env.TELNET_PORT || "2323"

const server = net.createServer( async (tcpsocket) => {
    let ipaddr = tcpsocket.remoteAddress
    let output = await geolookup(ipaddr,"Telnet Client")
    try {
        tcpsocket.write(output)
        tcpsocket.end()
    } catch (error) {
        log.error(`Exception for: ${ipaddr}`)
        log.debug(output)
    }

})

server.maxConnections = 10

server.listen(TELNET_PORT, '0.0.0.0',()=> { 
    log.info(`Telnet server started on port ${TELNET_PORT}!`)  
})

server.on('error', (err) => {
    log.error("Telnet Server Error!")
    console.log(err)
});



module.exports = server