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
    message (){
      setInterval(() => {
        let textarea = document.getElementById('syslog_messages');
        textarea.scrollTop = textarea.scrollHeight;        
      }, 100);

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
  }
}
</script>

<template>
 <div class="d-flex flex-column flex-fill ">
  <textarea class="d-flex flex-grow-1 form-control terminal text-white bg-dark" id="syslog_messages"  @onchange="changeHandler" :value="message"  readonly></textarea>
 </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
