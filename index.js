const net = require('net');
const path = require('path')
var geolite2 = require('geolite2');
var maxmind = require('maxmind');

var log = require("ucipass-logger")("ip")
log.transports.console.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info"
const TELNET_PORT = process.env.TELNET_PORT ? process.env.TELNET_PORT : "2323"

net.createServer( async (tcpsocket) => {
    let ipaddr = tcpsocket.remoteAddress
    let lookup_city = await maxmind.open(geolite2.paths.city)
    let geo1 = lookup_city.get(ipaddr);
    log.debug(geo1)
    let city = geo1?.city?.names?.en
    let country = geo1?.country?.names?.en
    let gps = `${geo1?.location?.latitude},${geo1?.location?.longitude}`
    let timezone = `${geo1?.location?.time_zone}`
    let lookup_asn = await maxmind.open(geolite2.paths?.asn)
    let geo2 = lookup_asn.get(ipaddr);
    log.debug(geo2)
    let as_number = geo2?.autonomous_system_number
    let as_org = geo2?.autonomous_system_organization
    let output = ""
    output += `##################################################\n`
    output += `IP address: ${ipaddr}\n`
    output += `City: ${city}\n`
    output += `Country: ${country}\n`
    output += `GPS: ${gps}\n`
    output += `TimeZone: ${timezone}\n`
    output += `AS Number: ${as_number}\n`
    output += `AS Org Name: ${as_org}\n`
    output += `##################################################\n`
    tcpsocket.write(output)
    tcpsocket.end()
    log_output = `${ipaddr},${country},${city},${gps},${timezone},${as_number},${as_org}`
    log.info(log_output)
}).listen(TELNET_PORT, '0.0.0.0',()=> { 
    log.info(`Telnet server started on port ${TELNET_PORT}!`)  
})
