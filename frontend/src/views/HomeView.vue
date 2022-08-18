<template>
  <NavBar/>
  <MessageArea/>
</template>

<script>
// @ is an alias to /src
// import { store } from "../store.js"
import NavBar        from '@/components/NavBar.vue'
import MessageArea   from '@/components/MessageArea.vue'

export default {
  name: 'HomeView',
  components: {
    // eslint-disable-next-line
    NavBar,MessageArea
  },
  mounted: async function() {
    console.log("mounted: HomeView")
  }
}
</script>

<style scoped>

/* div {
    display: flex;
    flex-direction: column;
} */

#row1 { background-color: red; }
#row2 { background-color: blue; }
#row3 { background-color: green; flex: 2; display: flex;}
#col1 { background-color: yellow; flex: 1 0  }
#col2 { background-color: orange; flex: 4 1  }
#col3 { background-color: purple; flex: 1 0 240px; }

</style>