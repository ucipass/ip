<template>
    <NavBar/>
    <MessageArea/>
    <ModalMessage/>
    <ModalConnections/>
</template>

<script>

import NavBar             from '@/components/NavBar.vue'
import MessageArea        from '@/components/MessageArea.vue'
import ModalMessage       from '@/components/ModalMessage.vue'
import ModalConnections   from '@/components/ModalConnections.vue'
import { Tooltip } from 'bootstrap'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line
    NavBar,MessageArea,ModalMessage,ModalConnections
  },
  methods: {
  },
  mounted: async function() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })
    console.log("mounted: App")
  }
}
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
  display: flex; 
  flex-direction: column;
}
</style>
