<script>
import { store } from "../store.js"
export default {
  name: 'ModalMessage',
  props: {
    config : Object
  },
  data() {
    return {
      store
    }
  },
  computed:{
    title(){
      let text = store.modalMessage.title || "Title"
      return text
    },
    message(){
      let text = store.modalMessage.message || "Message"
      return text
    }
  },
  mounted: async function() {
    console.log("mounted: modalConnections")  
  }
}
</script>

<template>
  <!-- Modal -->
  <div class="modal fade" id="modalConnections" tabindex="-1" aria-labelledby="socketioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalConnectionsLabel">Connection Status</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">

          <div class="accordion" id="accordionModalConnections">
            <p class="text-start text-decoration-underline m-0">Server:</p>
            <p class="text-start">Start time: {{store.socketIO.status.server_start}}</p>

            <p class="text-start text-decoration-underline m-0">Clients:</p>
            <div v-for="(value,  index) in store.socketIO.status.connections" :key="index" class="accordion-item">
              <h2 class="accordion-header" :id="'heading'+index">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+index" aria-expanded="true" aria-controls="collapseOne">
                  {{value.geo.ipaddr}}
                </button>
              </h2>
              <div :id="'collapse'+index" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionModalConnections">
                <div class="accordion-body">
                  {{value}}
                </div>
              </div>
            </div>

          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
