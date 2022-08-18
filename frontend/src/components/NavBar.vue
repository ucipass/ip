<template>
  <nav id="Navbar" class="navbar sticky-top navbar-expand navbar-dark bg-dark">
    <div class="container-fluid">

      <a class="navbar-brand m-0 p-0" href="#">
        <i class="bi bi-house-fill" style="font-size: 1.5rem;"></i>
      </a>
      <SocketIO/>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <!-- <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="#">Home</a>
          </li>
        </ul> -->


      </div>

    </div>
  </nav>
   <slot></slot> 
  
</template>

<script>
import { store } from "../store.js"
import SocketIO from "./SocketIO.vue";

export default {
  name: 'NavBar',
  components: {
    // eslint-disable-next-line
    SocketIO,
},  
  props: {
    config : Object
  },
  data() {
    return {
      store
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
