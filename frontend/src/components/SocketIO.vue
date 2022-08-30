<template>
  <div>
      <div class="btn-group btn-sm" role="group" aria-label="Basic example">

        <button type="button" :class="buttonClassPlay" @click="buttonPlay" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Resume log display">
          <i  class="bi bi-play-circle" :class="connected ? 'text-success'  : ' text-danger'"   style="font-size: 1.5rem;" ></i>   
        </button>
        <button type="button" :class="buttonClassPause" @click="buttonPause" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pause log display">
          <i class="bi bi-pause-circle" :class="connected ? 'text-success'  : ' text-danger'" style="font-size: 1.5rem;"></i>        
        </button>
        <button type="button" :class="buttonStatusStop" @click="buttonStop" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pause log display">
          <i class="bi bi-stop-circle " :class="connected ? 'text-success'  : ' text-danger'" style="font-size: 1.5rem;"></i>        
        </button>

        <button type="button" class="btn btn-sm text-light" @click="buttonTrash" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete logs">
          <i class="bi bi-trash text-success" style="font-size: 1.5rem;"></i>       
        </button>
        <button type="button" class="btn btn-sm text-light" @click="buttonSettings" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Settings">
          <i class="bi bi-gear text-success" style="font-size: 1.5rem;"></i>       
        </button>
        <button type="button" class="btn btn-sm  text-light" @click="buttonInformation"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Connection Information">
          <i id="socketio-icon" class="bi bi-info-circle text-success" style="font-size: 1.5rem;"></i>     
        </button>
        <button type="button" class="btn btn-sm text-light" @click="buttonHelp" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Help">
          <i class="bi bi-question-circle text-success" style="font-size: 1.5rem;"></i>       
        </button>
      </div>

  </div>
  
</template>

<script>
import { store } from "../store.js"
import { Queue } from "../queue.js"
import {io} from "socket.io-client"
import { Tooltip } from "bootstrap"
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
      connecting: false,
      connected: false,
      paused: false,
      socket: null
    }
  },
  computed:{
    buttonStatusConnecting(){
      return this.connecting
    },
    buttonStatusConnected(){
      return this.connected
    },
    buttonClassPlay(){
      return !this.connected || this.paused ? "btn btn-sm text-light"  : this.connecting ? "btn btn-sm disabled blink"  : "btn btn-sm disabled"
    },
    buttonClassPause(){
      return this.paused ? "btn btn-sm blink disabled" :  "btn btn-sm text-light "  
    },
    buttonStatusStop(){
      return this.connecting || this.connected ? "btn btn-sm text-light" : "btn btn-sm disabled" 
    },
  },
  methods: {
    showModalMessage(modalId){
      let elem = document.getElementById(modalId)
      let modal = new Modal(elem)
      modal.show()      
    },
    buttonTrash(ev){
      Tooltip.getInstance(ev.currentTarget).hide()
      store.output = `${(new Date()).toLocaleTimeString()} - Logs deleted.`
    },
    buttonPause(ev){
      Tooltip.getInstance(ev.currentTarget).hide()
      this.paused = !this.paused
      store.PauseOutput = store.output
    },
    buttonPlay(ev){
      Tooltip.getInstance(ev.currentTarget).hide()
      if (this.paused) {
        this.paused = false
      }
      else{
        this.startSIO()
      }
    },
    buttonStop(ev){
      Tooltip.getInstance(ev.currentTarget).hide()
      if (this.paused) {
        this.paused = false
      }
        this.stopSIO()        
    },
    buttonSettings(){
      store.modalMessage.title = "Settings"
      store.modalMessage.message = "This feature is not implemented yet!"
      this.showModalMessage('modalMessage')
    },
    buttonInformation(){
      this.socket.emit( "status", null ,(status) => {
        this.store.socketIO.status = status
        this.showModalMessage('modalConnections')        
      })

    },
    buttonHelp(){
      store.modalMessage.title = "Help"
      store.modalMessage.message = "This Web application listens to and monitors incoming connections for ICMP, HTTP, SSH & TELNET protocols. The application will provide Geo location and other protocol specific data that can be useful for network professional. There is no authentication requirement for any of the above protocols so the application should be considered insecure and should only be used for testing environments!  Inbound connections are rate-limited!"
      this.showModalMessage('modalMessage')
    },
    startSIO(){
      let messages = store.socketIO.messages
      this.connecting = true
      this.connected = false      
      this.socket = process.env.NODE_ENV === "development" ? io("ws://localhost:8888") : io()    
      let socket = this.socket      

      socket.on('connect', () => {
        console.log("Socket.io connected.")
        this.connecting = false
        this.connected = true
      })
      
      socket.on('disconnect', (reason) => {
        if (reason === "io server disconnect") {
          this.connecting = false
          this.connected = false
          console.log("The server has forcefully disconnected the socket:", reason)
        }
        else if (reason === "io client disconnect") {
          this.connecting = false
          this.connected = false
          console.log("The socket was manually disconnected using:", reason)
        }
        else if (reason === "ping timeout") {
          // Will try to reconnect
          this.connecting = true
          this.connected = false
          console.log("The server did not send a PING within the pingInterval:", reason)
        }
        else if (reason === "transport close") {
          // Will try to reconnect
          this.connecting = true
          this.connected = false
          console.log("	The connection was closed or lost:", reason)
        }
        else if (reason === "transport error") {
          // Will try to reconnect
          this.connecting = true
          this.connected = false
          console.log("The connection has encountered an error :", reason)
        }
        else {
          console.log("Unkown disconnetion reason:", reason)
        }
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

    },
    stopSIO(){
      this.socket.disconnect()
      this.connecting = false
      this.connected = false
    }

  },
  mounted: async function() {
    this.startSIO()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .blink {
    animation: blinker 0.6s linear infinite;
  }
  @keyframes blinker {
        50% {
          opacity: 0;
        }
      }
  .blink-one {
    animation: blinker-one 1s linear infinite;
  }
  @keyframes blinker-one {
    0% {
      opacity: 0;
    }
  }
  .blink-two {
    animation: blinker-two 1.4s linear infinite;
  }
  @keyframes blinker-two {
    100% {
      opacity: 0;
    }
  }
</style>
