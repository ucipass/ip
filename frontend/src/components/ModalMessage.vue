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
  mounted: async function() {
    console.log("mounted: ModalMessage")  
  }
}
</script>

<template>
      <!-- Modal -->
      <div class="modal fade" id="ModalMessage" tabindex="-1" aria-labelledby="socketioModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="socketioModalLabel">Modal title</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              This is my modal body
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
