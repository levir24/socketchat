<script>
import Socketchat from './Socketchat.vue'
import Users from './UserApp.vue'

export default {
  data() {
    return {
      nav: 'socketchat'
    }
  },
  components: {
    Socketchat,
    Users
  },
  
  props: { user: String }

}
</script>

<template>
  <div style="width: 100%">
    <div className="btn-group" role="group" style="padding: 10px">
        <button type="button" className="btn btn-outline-secondary" @click="nav = 'socketchat'">Socketchat</button>
        <button type="button" className="btn btn-outline-secondary" @click="nav = 'users'">Users</button>
    </div>

    <Socketchat v-if="nav === 'socketchat'" :user="user" />
    <Users v-if="nav === 'users'" />

  </div>  
</template>