var geolite2 = require('geolite2');
var maxmind = require('maxmind');
const log = require("./log.js")


module.exports = async function (ipaddr,source) {
    let lookup_city = await maxmind.open(geolite2.paths.city)
    let geo1 = lookup_city.get(ipaddr);
    log.debug(geo1)
    let city = geo1?.city?.names?.en || "UNKNOWN"
    let country = geo1?.country?.names?.en || "UNKNOWN"
    let latitude = geo1?.location?.latitude || "0"
    let longitude = geo1?.location?.longitude || "0"
    let gps = `${latitude},${longitude}`
    let timezone = `${geo1?.location?.time_zone}` || "UTC"
    let lookup_asn = await maxmind.open(geolite2.paths?.asn) 
    let geo2 = lookup_asn.get(ipaddr);
    log.debug(geo2)
    let as_number = geo2?.autonomous_system_number || "0"
    let as_org = geo2?.autonomous_system_organization || "UNKNOWN"

    let geo = {
        ipaddr: ipaddr,
        city: city,
        country: country,
        gps: gps,
        as_number, as_number,
        as_org, as_org
    }
    log_output = `${source} - ${ipaddr},${country},${city},${gps},${timezone},${as_number},${as_org}`
    log.info(log_output)    
    return geo
}