# Usage
Telnet and HTTP server that returns the client's IP address and related information based on the MaxMind GeoIP location database.

#Demo
![grab-landing-page](https://github.com/ucipass/ip/blob/main/telnet-geoip-from-gcp.gif)

# Installation
before installation make sure you use your maxmind license key
```
export MAXMIND_LICENSE_KEY=DcKHcgwnPJzs2zonifsfdddf
npm install
npm start
```
The default Telnet listening port is 2323, but can be changed with env variable TELNET_PORT.
The default HTTP listening port is 8080, but can be changed with env variable TELNET_PORT.
If you also need it on a privileged port like port 23 you may want to use iptables redirection.
```
sudo iptables -A PREROUTING -t nat -p tcp --dport 23 -j REDIRECT --to-port 2323
sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 8080
```