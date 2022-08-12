const log = require("./log.js")
const http = require('http');
const express = require('express');
const https = require("https")
const fs = require("fs");

const HTTP_PORT = process.env.HTTP_PORT ? process.env.HTTP_PORT : "8080"
const HTTPS_PORT = process.env.HTTPS_PORT ? process.env.HTTPS_PORT : "8443"
const CERT_PEM = process.env.CERT_PEM || "cert.pem"
const CERT_KEY = process.env.CERT_KEY || "cert.key"


// HTTPS SERVER
const options = {
    key: fs.readFileSync(CERT_KEY),
    cert: fs.readFileSync(CERT_PEM)
};

const app = express();
app.use((req, res) => {
	res.set('Alt-Svc', 'h3=":4433');
	res.writeHead(200);
	res.end("If you see this you are NOT using QUIC! The alt-svc redirection did not work!\n");
});
http.createServer(app).listen(HTTP_PORT,"0.0.0.0", ()=>{ 
	log.info(`HTTP server started on port ${HTTP_PORT}!`)  
});
https.createServer(options, app).listen(HTTPS_PORT,"0.0.0.0", ()=>{ 
	log.info(`HTTPS server started on port ${HTTPS_PORT}!`)  
});



