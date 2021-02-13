# ip
Telnet server that returns the client's IP address and related information based on the MaxMind, GeoIP location database

# installation
before installation make sure you use your maxmind license key
```
export MAXMIND_LICENSE_KEY=DcKHcgwnPJzs2zonifsfdddf
```
If you need to run this program on privileged ports like port 23 you may want to use iptables redirection
```
sudo iptables -A PREROUTING -t nat -p tcp --dport 23 -j REDIRECT --to-port 2323
```