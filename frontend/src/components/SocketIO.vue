<template>
      <a class="navbar-brand m-0 ms-2 p-0" href="#">
        <i id="socketio-icon" class="bi bi-info-square" style="font-size: 1.5rem;"></i>
      </a>
</template>

<script>
import { store } from "../store.js"
import {io} from "socket.io-client"

export default {
  name: 'SocketIO',
  props: {
    config : Object
  },
  data() {
    return {
      store
    }
  },
  mounted: async function() {
    console.log("mounted: Socket.IO")
    let elements = document.getElementById('socketio-icon');
    // const socket = io("ws://localhost:8888")
    const socket = io()    

    socket.on('connect', () => {
      console.log("Socket.io connected.")
      elements.classList.remove("text-danger");
      elements.classList.add("text-success");
    })
    
    socket.on('disconnect', (reason) => {
      console.log("Socket.io disconnection due to:", reason)
      elements.classList.remove("text-success");
      elements.classList.add("text-danger");
    })

    socket.on("telnet", (arg) => {
      try {
        console.log(arg)
        store.output += "\n" + "(Telnet): "      
        store.output += `IP: ${arg.ipaddr}, `
        store.output += `City: ${arg.city}, `   
        store.output += `Country: ${arg.country}, `
        store.output += `AS Number: ${arg.as_number}, `
        store.output += `AS Organization: ${arg.as_org}, `   
        store.output += `GPS: ${arg.gps}`   
      } catch (error) {
        console.log(error)
        store.output += "\n" + "Telnet: invalid data received from server!"  
      }
    })
    socket.on("syslog", (arg) => {
      try {
        
        let json = JSON.parse(arg)
        console.log(json)
        store.output += "\n" + "(Syslog): "      
        store.output += `IP: ${json.ipaddr}, `
        store.output += `Message: ${json.msg}, `   
        store.output += `City: ${json.city}, `   
        store.output += `Country: ${json.country}, `
        store.output += `AS Number: ${json.as_number}, `
        store.output += `AS Organization: ${json.as_org}, `   
        store.output += `GPS: ${json.gps}`
      } catch (error) {
        console.log(error)
        store.output += "\n" + "Syslog: invalid data received from server!"  
      }
    })      
    socket.on("ssh", (arg) => {
      try {
        
        let json = JSON.parse(arg)
        console.log(json)
        store.output += "\n" + "(SSH): "      
        store.output += `IP: ${json.ipaddr}, `
        store.output += `Message: ${json.msg}, `   
        store.output += `City: ${json.city}, `   
        store.output += `Country: ${json.country}, `
        store.output += `AS Number: ${json.as_number}, `
        store.output += `AS Organization: ${json.as_org}, `   
        store.output += `GPS: ${json.gps}`
      } catch (error) {
        console.log(error)
        store.output += "\n" + "Syslog: invalid data received from server!"  
      }
    })      

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
