<script>
import Socketchat from './Socketchat.vue'
//import Users from './UserApp.vue'
//import Tables from './TablesApp.vue'

export default {
  data() {
    return {
      nav: 'socketchat'
    }
  },
  components: {
    Socketchat
    //Users,
    //Tables
  },
  
  //props: { floor: Object, zone: Object }

}
</script>

<template>
  <div style="width: 100%">
    <div className="btn-group" role="group" style="padding: 10px">
        <button type="button" className="btn btn-outline-secondary" @click="nav = 'socketchat'">Socketchat</button>
        <button type="button" className="btn btn-outline-secondary" @click="nav = 'users'">Users</button>
        <button type="button" className="btn btn-outline-secondary" @click="nav = 'table'">Tables</button>
    </div>

    <Socketchat v-if="nav === 'socketchat'" />
    <Users v-if="nav === 'users'" />
    <Tables v-if="nav === 'table'" />

  </div>  
</template>