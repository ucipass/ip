<template>
  <div>
      <div class="btn-group btn-sm" role="group" aria-label="Basic example">
        <!-- <button type="button" class="btn btn-sm" :class="`${connected ? 'disabled' : ''}`" @click="buttonPlay">
          <div v-if='connected' class="spinner-border text-success b-0" role="status" style="font-size: 0.75rem; height: 1.5rem; width: 1.5rem;">
            <span class="visually-hidden">Loading...</span>
          </div>     
        </button> -->
        <button type="button" class="btn btn-sm text-light" @click="store.socketIO.pause=!store.socketIO.pause">
          <i v-if="store.socketIO.pause" class="bi bi-play-circle" :class="`${connected ? 'text-success' : 'text-secondary'}`" style="font-size: 1.5rem;"></i>   
          <i v-else class="bi bi-pause-circle" :class="`${connected ? 'text-success' : 'text-secondary'}`" style="font-size: 1.5rem;"></i>        
        </button>
        <button type="button" class="btn btn-sm text-light" @click="buttonTrash">
          <i class="bi bi-trash text-success" style="font-size: 1.5rem;"></i>       
        </button>
        <button type="button" class="btn btn-sm text-light" @click="buttonSettings">
          <i class="bi bi-gear text-success" style="font-size: 1.5rem;"></i>       
        </button>
        <button type="button" class="btn btn-sm text-light" @click="buttonInformation">
          <i v-if="connected" id="socketio-icon" class="bi bi-info-circle text-success" style="font-size: 1.5rem;"></i>
          <i v-if="!connected" id="socketio-icon" class="bi bi-x-circle text-danger" style="font-size: 1.5rem;"></i>        
        </button>
        <button type="button" class="btn btn-sm text-light" @click="buttonHelp">
          <i class="bi bi-question-circle text-success" style="font-size: 1.5rem;"></i>       
        </button>
      </div>

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
    showModalMessage(){
      let elem = document.getElementById('modalMessage')
      let modal = new Modal(elem)
      modal.show()      
    },
    buttonTrash(){
      store.output = `${(new Date()).toLocaleTimeString()} - Logs deleted.`
    },
    buttonSettings(){
      store.modalMessage.title = "Settings"
      store.modalMessage.message = "This feature is not implemented yet!"
      this.showModalMessage()
    },
    buttonInformation(){
      store.modalMessage.title = "Information"
      store.modalMessage.message = store.socketIO.status
      this.showModalMessage()
    },
    buttonHelp(){
      store.modalMessage.title = "Help"
      store.modalMessage.message = "This Web application listens to and monitors incoming connections for ICMP, HTTP, SSH & TELNET protocols. The application will provide Geo location and other protocol specific data that can be useful for network professional. There is no authentication requirement for any of the above protocols so the application should be considered insecure and should only be used for testing environments!  Inbound connections are rate-limited!"
      this.showModalMessage()
    },

  },
  mounted: async function() {
    let messages = store.socketIO.messages
    console.log("mounted: Socket.IO")
    const socket = process.env.NODE_ENV === "development" ? io("ws://localhost:8888") : io()    

    socket.on('connect', () => {
      console.log("Socket.io connected.")
      this.connected = true
    })
    
    socket.on('disconnect', (reason) => {
      console.log("Socket.io disconnection due to:", reason)
      this.connected = false
    })

    messages.icmp = messages.icmp || new Queue() ; 
    socket.on("icmp", (arg) => {
        messages.icmp.enqueue(arg)
    })

    messages.ssh = messages.ssh || new Queue() ; 
    socket.on("ssh", (arg) => {
        messages.ssh.enqueue(arg)
    })

    messages.telnet = messages.telnet || new Queue() ; 
    socket.on("telnet", (arg) => {
        messages.telnet.enqueue(arg)
    })

    messages.http = messages.http || new Queue() ; 
    socket.on("http", (arg) => {
        messages.http.enqueue(arg)
    })

    socket.on("status", (arg) => {
      try {
        store.socketIO.status = arg
      } catch (error) {
        console.log("status",error)
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
