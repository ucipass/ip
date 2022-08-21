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
    console.log("mounted: ModalMessage")  
  }
}
</script>

<template>
      <!-- Modal -->
      <div class="modal fade" id="modalMessage" tabindex="-1" aria-labelledby="socketioModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="socketioModalLabel">{{title}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              {{message}}
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
