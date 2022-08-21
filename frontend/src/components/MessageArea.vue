<script>
import { store } from "../store.js"
export default {
  name: 'MessageArea',
  props: {
    config : Object
  },
  data() {
    return {
      store
    }
  },
  watch:{
    // Scroll down when textarea changes
    async message (){
      await new Promise(resolve => setTimeout(resolve, 10));
      let textarea = document.getElementById('syslog_messages');
      textarea.scrollTop = textarea.scrollHeight;  
    }
  },
  computed: {
    message() {
      return store.output
    }
  },
  methods: {
    handler_icmp(){
      let icmp = store.socketIO.messages.icmp || {}
      while(icmp.length){
        try {
          let arg = icmp.dequeue()
          console.log(arg)
          let msg = `\n${(new Date()).toLocaleTimeString()} - ${arg.ipaddr}, ICMP, `      
          msg += `City: ${arg.city}, `   
          msg += `Country: ${arg.country}, `
          msg += `AS Number: ${arg.as_number}, `
          msg += `AS Organization: ${arg.as_org}, `   
          msg += `GPS: ${arg.gps}`
          store.output += msg;
        } catch (error) {
          console.log(error)
        }        
      }
    },
    handler_ssh(){
      let ssh = store.socketIO.messages.ssh || {}
      while(ssh.length){
        try {
          let arg = ssh.dequeue()
          console.log(arg)
          let msg = `\n${(new Date()).toLocaleTimeString()} - ${arg.ipaddr}, SSH, `      
          msg += `City: ${arg.city}, `   
          msg += `Country: ${arg.country}, `
          msg += `AS Number: ${arg.as_number}, `
          msg += `AS Organization: ${arg.as_org}, `   
          msg += `GPS: ${arg.gps}`
          store.output += msg;
        } catch (error) {
          console.log(error)
        }        
      }
    },
    handler_telnet(){
      let telnet = store.socketIO.messages.telnet || {}
      while(telnet.length){
        try {
          let arg = telnet.dequeue()
          console.log(arg)
          let msg = `\n${(new Date()).toLocaleTimeString()} - ${arg.ipaddr}, TELNET, `      
          msg += `City: ${arg.city}, `   
          msg += `Country: ${arg.country}, `
          msg += `AS Number: ${arg.as_number}, `
          msg += `AS Organization: ${arg.as_org}, `   
          msg += `GPS: ${arg.gps}`
          store.output += msg;
        } catch (error) {
          console.log(error)
        }        
      }
    },
    handler_http(){
      let http = store.socketIO.messages.http || {}
      while(http.length){
        try {
          let arg = http.dequeue()
          console.log(arg)
          let msg = `\n${(new Date()).toLocaleTimeString()} - ${arg.ipaddr}, HTTP, `      
          msg += `City: ${arg.city}, `   
          msg += `Country: ${arg.country}, `
          msg += `AS Number: ${arg.as_number}, `
          msg += `AS Organization: ${arg.as_org}, `   
          msg += `GPS: ${arg.gps}`
          store.output += msg;
        } catch (error) {
          console.log(error)
        }        
      }
    }
  },
  mounted: async function() {
    console.log("mounted: MessageArea")

    setInterval(() => {
      this.handler_ssh()
      this.handler_icmp()
      this.handler_telnet()
      this.handler_http()
      

    }, 100);
  
  }      



}
</script>

<template>
 <div class="d-flex flex-column flex-fill ">
  <textarea class="d-flex flex-grow-1 form-control terminal text-white bg-dark" id="syslog_messages" :value="message"  readonly></textarea>
 </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
