const net = require('net');
const path = require('path')
const requestIp = require('request-ip');
var geolite2 = require('geolite2');
var maxmind = require('maxmind');
const http = require('http');

var log = require("ucipass-logger")("ip")
log.transports.console.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info"
const TELNET_PORT = process.env.TELNET_PORT ? process.env.TELNET_PORT : "2323"
const HTTP_PORT = process.env.HTTP_PORT ? process.env.HTTP_PORT : "8080"

// GEO LOOKUP
async function get_ip_info(ipaddr) {
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
    output += `##################################################\r\n`
    output += `Your source IP address: ${ipaddr}\r\n`
    output += `City: ${city}\r\n`
    output += `Country: ${country}\r\n`
    output += `GPS: ${gps}\r\n`
    output += `TimeZone: ${timezone}\r\n`
    output += `AS Number: ${as_number}\r\n`
    output += `AS Org Name: ${as_org}\r\n`
    output += `##################################################\r\n`
    return output
}

// TELNET SERVER
net.createServer( async (tcpsocket) => {
    let ipaddr = tcpsocket.remoteAddress
    let output = await get_ip_info(ipaddr)
    tcpsocket.write(output)
    tcpsocket.end()
    log_output = `${ipaddr},${country},${city},${gps},${timezone},${as_number},${as_org}`
    log.info(log_output)
}).listen(TELNET_PORT, '0.0.0.0',()=> { 
    log.info(`Telnet server started on port ${TELNET_PORT}!`)  
})

// HTTP SERVER
var server = http.createServer(async function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  const ipaddr = requestIp.getClientIp(req); 
  let output = await get_ip_info(ipaddr)
  res.end(output);
//   res.end('Hello ' + req.socket.remoteAddress + '!');
  // Client address in request -----^
});
server.on('connection', function(sock) {
  console.log('Client connected from ' + sock.remoteAddress);
  // Client address at time of connection ----^
});
server.listen(HTTP_PORT, '0.0.0.0',()=> { 
    log.info(`HTTP server started on port ${HTTP_PORT}!`)  
})

//SYSLOG SERVER

const Syslog = require('simple-syslog-server') ;

// Create our syslog server with the given transport
const socktype = 'UDP' ; // or 'TCP' or 'TLS'
const address = '' ; // Any
const port = 5514 ;
var server = Syslog(socktype) ;

// State Information
var listening = false ;
var clients = [] ;
var count = 0 ;

server.on('msg', data => {
	console.log('message received (%i) from %s:%i\n%o\n', ++count, data.address, data.port, data) ;
	/*
	message received (1) from ::ffff:192.168.1.13:59666
	{
	  "facility": "daemon",
	  "facilityCode": 3,
	  "severity": "info",
	  "severityCode": 6,
	  "tag": "systemd[1]",
	  "timestamp": "2018-12-26T17:53:57.000Z",
	  "hostname": "localhost",
	  "address": "::ffff:192.168.1.13",
	  "family": "IPv6",
	  "port": 20514,
	  "size": 80,
	  "msg": "Started Daily apt download activities."
	}	
	*/
})
.on('invalid', err => {
	console.warn('Invalid message format received: %o\n', err) ;
})
.on('error', err => {
	console.warn('Client disconnected abruptly: %o\n', err) ;
})
.on('connection', s => {
	let addr = s.address().address ;
	console.log(`Client connected: ${addr}\n`) ;
	clients.push(s) ;
	s.on('end', () => {
		console.log(`Client disconnected: ${addr}\n`) ;
		let i = clients.indexOf(s) ;
		if(i !== -1)
			clients.splice(i, 1) ;
	}) ;
})
.listen({host: address, port: port})
.then(() => {
	listening = true ;
	log.info(`Syslog started on: ${address}:${port}`) ;
})
.catch(err => {
	if ((err.code == 'EACCES') && (port < 1024)) {
		console.error('Cannot listen on ports below 1024 without root permissions. Select a higher port number: %o', err) ;
	}
	else { // Some other error so attempt to close server socket
		console.error(`Error listening to ${address}:${port} - %o`, err) ;
		try {
			if(listening)
				server.close() ;
		}
		catch (err) {
			console.warn(`Error trying to close server socket ${address}:${port} - %o`, err) ;
		}
	}
}) ;
