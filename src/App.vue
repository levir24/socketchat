<script>

import { BASEURL, baseFetch, baseReload } from './components/baseManager'
import LoginApp from './components/LoginApp.vue'
import NavApp from './components/NavApp.vue'


export default {

    data() {
        return {
            websocket: null,
            connected: false,
            messages: [],
            newMessage: '',
            islogin: false,
            version: '05.22.24',
            user: "",
            timer: "12:00"
        
        }
    },

    components: {
        LoginApp,
        NavApp
    },

    mounted() {
    this.startClock()
    },

    methods: {
        
        login(user) {
            this.user = user
            },

        async startClock() {
            var servtime = await baseReload(BASEURL + `/system/time`);
            this.servtime = parseInt(servtime.servtime);
            setInterval(this.updtTimer, 1000);
            },

        updtTimer() {
            this.servtime += 1000;
            var now = new Date(this.servtime).getTime();
            var ND = new Date(now).toLocaleString("en-CA", { hour12: false });
            this.timer = ND.slice(0, 20).replace("T", " ").replace(",","");
            },

      
    },

    
}
</script>

<template>


<div class="container-fluid">
          <div class="row align-items-start">
            <div class="col-2"></div>
            <div class="col-2 "><h3 style="padding-top: 10px;">Web Chat </h3></div>
            <div class="col-2"><h4 style="padding-top: 10px;">{{ version }} </h4></div>
            <div class="col-2"><h3 style="padding-top: 10px;">{{ user }}</h3></div>
            <div class="col-4"><h4 style="padding-top: 10px">{{ timer }}</h4></div>
        </div>

        <div class="row align-items-start">
        <div class="col-2">     
            <div class="card" style="background-color: lightgray">
              <a @click="islogin = !islogin">
                  <i class="blue bi-folder-fill"></i>
                  Login</a> 
                <LoginApp v-if="islogin" @login="login"/>
              <a @click="tableSave">
                <i class="red bi-file-arrow-down"></i>
              Save</a>

            </div>
        </div>

        <div class="col-10">
            <div class="card" style="background-color: lightgray">
                <NavApp :user="user"/>
            </div>
        </div>
        </div>
    </div>


</template>
