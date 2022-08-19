const log = require("./log.js")
const http = require('http');
const express = require('express');
const https = require("https")
const parser = require('ua-parser-js');
const fs = require("fs");
const geolookup = require('./geolookup.js')
const requestIp = require('request-ip');

const HTTP_PORT = process.env.HTTP_PORT ? process.env.HTTP_PORT : "8080"
const HTTPS_PORT = process.env.HTTPS_PORT ? process.env.HTTPS_PORT : "8443"
const CERT_PEM = process.env.CERT_PEM || "cert.pem"
const CERT_KEY = process.env.CERT_KEY || "cert.key"


// HTTPS QUIC/HTTP3 SERVER

if (fs.existsSync(CERT_KEY) && fs.readFileSync(CERT_PEM)) {
    const htmlpage = fs.readFileSync('index.html', 'utf8');
    const options = {
        key: fs.readFileSync(CERT_KEY),
        cert: fs.readFileSync(CERT_PEM)
    };
    
    const app_secure = express();
    app_secure.use((req, res) => {
        res.set('alt-svc', 'h3=":443"; ma=2592000,h3-27=":443"; ma=2592000,h3-29=":443"; ma=2592000,quic=":443"; ma=2592000');
        res.set('Cache-Control','private, no-cache, no-store, must-revalidate')
        res.set('Content-Type','text/html')
        //res.set('X-Content-Type-Options','nosniff')
        res.writeHead(200);	res.end(htmlpage);
    });
    
    const server_secure = https.createServer(options, app_secure).listen(HTTPS_PORT,"0.0.0.0", ()=>{ 
        log.info(`HTTPS server started on port ${HTTPS_PORT}!`)  
    });   
}else{
    log.warn(`Certificate files (CERT_PEM/CERT_KEY) ${CERT_PEM}/${CERT_KEY} do not exists!`)
}



//HTTP SERVER
const app = express();
app.use("/", async (req, res, next) => {
    var ua = parser(req.headers['user-agent']);
    log.debug(ua.engine.name)
    if (ua.engine.name){
        next()  
    }else{
        const ipaddr = requestIp.getClientIp(req); 
        let output = await geolookup(ipaddr,"Telnet Client")
        output_string = JSON.stringify(output, null, 2)
        res.writeHead(200);	res.end(output_string);
    }
    
  })
app.use(express.static('./frontend/dist'))

module.exports = new Promise((resolve, reject) => {
    const server = http.createServer(app).listen(HTTP_PORT,"0.0.0.0", ()=>{ 
        log.info(`HTTP server started on port ${HTTP_PORT}!`) 
        resolve(server)           
    });
});
