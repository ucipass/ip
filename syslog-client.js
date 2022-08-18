// const os = require("os")
// const syslog = require("syslog-client");
// const SYSLOG_PORT = process.env.SYSLOG_PORT ? process.env.SYSLOG_PORT : "5514"

// const syslog_options = {
//     syslogHostname: os.hostname(),
//     transport: syslog.Transport.Udp,
//     port: SYSLOG_PORT,
//     rfc3164:  true
// };
 
// const client = syslog.createClient("127.0.0.1", syslog_options);

// const message_options = {
//     // facility: "debug",
//     // severity: "Informational"
// };
 
// const message = "something is wrong with this daemon!";
 
// client.log(message, message_options, function(error) {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log("sent message successfully");
//     }
// });


const winston = require('winston');
// Requiring `winston-syslog` will expose `winston.transports.Syslog`
require('winston-syslog').Syslog;
const options = {
    // host: "localhost",
    port: 5514,
    // protocol: "udp4"
}
const transport = new winston.transports.Syslog(options);
const logger = new winston.createLogger({ transports: [transport] });

logger.log('info', 'Test message to actually use socket');
logger.remove(transport);