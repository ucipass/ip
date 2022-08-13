const net = require('net')
const log = require('./log.js')
const geolookup = require('./geolookup.js')
const TELNET_PORT = process.env.TELNET_PORT || "2323"

module.exports = net.createServer( async (tcpsocket) => {
    let ipaddr = tcpsocket.remoteAddress
    let output = await geolookup(ipaddr,"Telnet Client")
    tcpsocket.write(output)
    tcpsocket.end()
}).listen(TELNET_PORT, '0.0.0.0',()=> { 
    log.info(`Telnet server started on port ${TELNET_PORT}!`)  
}).on('error', (err) => {
    console.log(err)
});
