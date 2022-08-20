# Usage
Telnet and HTTP server that returns the client's IP address and related information based on the MaxMind GeoIP location database.
The server also runs syslog service on a UDP port to allow firewall logs to be forwarded and displayed on the console. This solution is created to display log related to protocols like ICMP that is handled by the Linux Kernel.

#Demo
![grab-landing-page](https://github.com/ucipass/ip/blob/main/telnet-geoip-from-gcp.gif)

# Installation
before installation make sure you use your maxmind license key and set optional environment variables:
- The default Telnet listening port is 2323, but can be changed with env variable TELNET_PORT.
- The default HTTP listening port is 8080, but can be changed with env variable HTTP_PORT.
- The default Syslog listening port is 5514, but can be changed with env variable SYSLOG_PORT.
```
export MAXMIND_LICENSE_KEY=DcKHcgwnPJzs2zonifsfdddf
npm install
npm start
```
If you also need it on a privileged port like port 23 you may want to use iptables redirection.
```
sudo iptables -A PREROUTING -t nat -p tcp --dport 23 -j REDIRECT --to-port 2323
sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 8080

# OPTIONAL ADD iptables rules to log ICMP packets to syslog
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j LOG --log-level info --log-prefix "ping "
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# add the below line to a rsyslog configuration file to forward logs to the syslog port
kern.info                       @127.0.0.1:5514
```

# Testing
```
# Test GeoIP functionality by setting the HTTP header
curl -H "X-Forwarded-For: 152.66.115.1" localhost:8080
```