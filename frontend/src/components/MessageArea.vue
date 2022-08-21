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
  },
  mounted: async function() {
    console.log("mounted: MessageArea")
    setInterval(() => {
      
      let telnet = store.socketIO.messages.telnet || {}
      let msg = ""
      while(telnet.length){
        msg += telnet.dequeue()
      }
      if ( msg.length > 0 ){
        store.output += msg
      }

      let ssh = store.socketIO.messages.ssh || {}
      let ssh_msg = ""
      while(ssh.length){
        ssh_msg += ssh.dequeue()
      }
      if ( ssh_msg.length > 0 ){
        store.output += ssh_msg
      }

      let icmp = store.socketIO.messages.icmp || {}
      let icmp_msg = ""
      while(icmp.length){
        icmp_msg += icmp.dequeue()
      }
      if ( icmp_msg.length > 0 ){
        store.output += icmp_msg
      }

      let http = store.socketIO.messages.http || {}
      let http_msg = ""
      while(http.length){
        http_msg += http.dequeue()
      }
      if ( http_msg.length > 0 ){
        store.output += http_msg
      }
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
