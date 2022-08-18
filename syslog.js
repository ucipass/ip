//SYSLOG SERVER
const Syslog = require('simple-syslog-server') ;
const log = require('./log.js')
const SYSLOG_PORT = process.env.SYSLOG_PORT ? process.env.SYSLOG_PORT : "5514"
const net = require('net');
const path = require('path')
const requestIp = require('request-ip');
const sio = require("./sio.js")
const geolookup = require('./geolookup.js')

// Create our syslog server with the given transport
const socktype = 'UDP' ; // or 'TCP' or 'TLS'
const address = '' ; // Any
const port = SYSLOG_PORT ;
var server = Syslog(socktype) ;

// State Information
var listening = false ;
var clients = [] ;
var count = 0 ;

async function send_io(json){
	ipaddr = json.address
    let output = await geolookup(ipaddr,"Telnet Client")
	output.msg = json.msg
    output_string = JSON.stringify(output, null, 2)	
	const io = await sio
	io.of("/").emit("syslog",output_string)
}

server.on('msg', data => {
	console.log('message received (%i) from %s:%i\n%o\n', ++count, data.address, data.port, data) ;
	if ( data.msg.search("PROTO=ICMP") < 0 ) {
		const json = {
			address: data.address,
			msg: data.msg
		}
		send_io(json)	
	}else{
		const regex = /SRC=(.*) DST=/;
		const found = data.msg.match(regex)
		console.log(found)
	}

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
	log.info(`Syslog started on port: ${address}:${port}`) ;
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


module.exports = server