<template>
  <div>
      <button type="button" class="btn btn-sm text-light" @click="socketIOPopup">
        <i v-if="connected" id="socketio-icon" class="bi bi-check-circle text-success" style="font-size: 1.5rem;"></i>
        <i v-if="!connected" id="socketio-icon" class="bi bi-x-circle text-danger" style="font-size: 1.5rem;"></i>        
      </button>
  </div>
</template>

<script>
import { store } from "../store.js"
import { Queue } from "../queue.js"
import {io} from "socket.io-client"
// eslint-disable-next-line 
import { Modal } from 'bootstrap'

export default {
  name: 'SocketIO',
  props: {
    config : Object
  },
  data() {
    return {
      store,
      connected: false
    }
  },
  methods: {
    socketIOPopup(){
      let elem = document.getElementById('ModalMessage')
      let modal = new Modal(elem)
      modal.show()
      console.log("ev")
    }
  },
  mounted: async function() {
    let messages = store.socketIO.messages
    console.log("mounted: Socket.IO")
    // let elements = document.getElementById('socketio-icon');
    // const socket = io("ws://localhost:8888")
    const socket = process.env.NODE_ENV === "development" ? io("ws://localhost:8888") : io()    

    socket.on('connect', () => {
      console.log("Socket.io connected.")
      this.connected = true
      // elements.classList.remove("text-danger");
      // elements.classList.add("text-success");
    })
    
    socket.on('disconnect', (reason) => {
      console.log("Socket.io disconnection due to:", reason)
      // elements.classList.remove("text-success");
      // elements.classList.add("text-danger");
      this.connected = false
    })

    messages.icmp = messages.icmp || new Queue() ; 
    socket.on("icmp", (arg) => {
      try {
        console.log(arg)
        let msg = "\n" + "(ICMP): "      
        msg += `IP: ${arg.ipaddr}, `
        msg += `City: ${arg.city}, `   
        msg += `Country: ${arg.country}, `
        msg += `AS Number: ${arg.as_number}, `
        msg += `AS Organization: ${arg.as_org}, `   
        msg += `GPS: ${arg.gps}`
        messages.icmp.enqueue(msg)
      } catch (error) {
        console.log(error)
        messages.icmp.enqueue("\n" + "ICMP: invalid data received from server!")
      }
    })
    
    messages.ssh = messages.ssh || new Queue() ; 
    socket.on("ssh", (arg) => {
      try {
        console.log(arg)
        let msg = "\n" + "(SSH): "      
        msg += `IP: ${arg.ipaddr}, `
        msg += `City: ${arg.city}, `   
        msg += `Country: ${arg.country}, `
        msg += `AS Number: ${arg.as_number}, `
        msg += `AS Organization: ${arg.as_org}, `   
        msg += `GPS: ${arg.gps}`
        messages.ssh.enqueue(msg)
      } catch (error) {
        console.log(error)
        messages.ssh.enqueue("\n" + "SSH: invalid data received from server!")
      }
    })
    
    messages.telnet = messages.telnet || new Queue() ; 
    socket.on("telnet", (arg) => {
      try {
        console.log(arg)
        let msg = "\n" + "(TELNET): "      
        msg += `IP: ${arg.ipaddr}, `
        msg += `City: ${arg.city}, `   
        msg += `Country: ${arg.country}, `
        msg += `AS Number: ${arg.as_number}, `
        msg += `AS Organization: ${arg.as_org}, `   
        msg += `GPS: ${arg.gps}`
        messages.telnet.enqueue(msg)
      } catch (error) {
        console.log(error)
        messages.telnet.enqueue("\n" + "Telnet: invalid data received from server!")
      }
    })
    
    messages.http = messages.http || new Queue() ; 
    socket.on("http", (arg) => {
      try {
        console.log(arg)
        let msg = "\n" + "(HTTP): "      
        msg += `IP: ${arg.ipaddr}, `
        msg += `City: ${arg.city}, `   
        msg += `Country: ${arg.country}, `
        msg += `AS Number: ${arg.as_number}, `
        msg += `AS Organization: ${arg.as_org}, `   
        msg += `GPS: ${arg.gps}`
        messages.http.enqueue(msg)
      } catch (error) {
        console.log(error)
        messages.http.enqueue("\n" + "HTTP: invalid data received from server!")
      }
    })
    
    socket.on("syslog", (arg) => {
      try {
        let json = JSON.parse(arg)
        store.output += "\n" + "(Syslog): "      
        store.output += `IP: ${json.ipaddr}, `
        store.output += `Message: ${json.msg}, `   
      } catch (error) {
        store.output += "\n" + "Syslog: invalid data received from server!"  
      }
    })          

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
