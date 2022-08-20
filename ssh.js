const log = require('./log.js')
const geolookup = require('./geolookup.js')
const sio = require("./sio.js")
const { readFileSync } = require('fs');
const { utils: { parseKey }, Server } = require('ssh2');
const SSH_PORT = process.env.SSH_PORT || "2222"

const server = new Server({
  hostKeys: [readFileSync('host.key')],
  algorithms:  {
    cipher: ["aes128-gcm","aes128-gcm@openssh.com","aes256-gcm","aes256-gcm@openssh.com","aes128-ctr","aes192-ctr","aes256-ctr","3des-cbc","aes256-cbc","aes192-cbc","aes128-cbc"],
    compress: ["none"],
    hmac: ["hmac-sha2-256-etm@openssh.com","hmac-sha2-512-etm@openssh.com","hmac-sha1-etm@openssh.com","hmac-sha2-256","hmac-sha2-512","hmac-sha1","hmac-md5","hmac-sha2-256-96","hmac-sha2-512-96","hmac-sha1-96","hmac-md5-96"],
    kex: ["curve25519-sha256","curve25519-sha256@libssh.org","ecdh-sha2-nistp256","ecdh-sha2-nistp384","ecdh-sha2-nistp521","diffie-hellman-group-exchange-sha256","diffie-hellman-group14-sha256","diffie-hellman-group15-sha512","diffie-hellman-group16-sha512","diffie-hellman-group17-sha512","diffie-hellman-group18-sha512","diffie-hellman-group-exchange-sha1","diffie-hellman-group14-sha1","diffie-hellman-group1-sha1" ]
  }
}, (client) => {
    log.debug('SSH Client disconnected');

  client.on('authentication', (ctx) => {
    let allowed = true;
    if (allowed)
      ctx.accept();
    else
      ctx.reject();
  }).on('ready', () => {
    log.debug('SSH Client authenticated');

    client.once('session', (accept, reject) => {
        accept().once('pty', (accept, reject, info) => {
          rows = info.rows;
          cols = info.cols;
          term = info.term;
          accept && accept();
        }).on('window-change', (accept, reject, info) => {
          rows = info.rows;
          cols = info.cols;
          if (stream) {
            stream.rows = rows;
            stream.columns = cols;
            stream.emit('resize');
          }
          accept && accept();
        }).once('shell', async (accept, reject) => {
          stream = accept();
          ipaddr = client._sock.remoteAddress
          let output = await geolookup(ipaddr,"SSH Client")
          let output_string = JSON.stringify(output)
          stream.write(output_string);
          stream.exit(0);
          stream.end();
          const io = await sio
          io.of("/").emit("ssh",output)          
        });
      });
  }).on('close', () => {
    log.debug('SSH Client disconnected');
  }).on('error', (error) => {
    log.debug('SSH Client Error');
  });
}).listen( SSH_PORT , '0.0.0.0', function() {
    log.info(`SSH2 server started on port ${SSH_PORT}!`)  
}).on('error', (error) => {
  log.debug('SSH Server Error');
});