<script>

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
            version: '05.22.24'
        }
    },

    components: {
        LoginApp,
        NavApp
    },

    methods: {
        login() { },
        connectWebSocket() {
            this.websocket = new WebSocket('ws://localhost:3000'); // Change URL to your WebSocket server

            this.websocket.onopen = () => {
                this.connected = true;
            }

            this.websocket.onmessage = (event) => {
                event.data.text().then(tx => {
                    const message = JSON.parse(tx)
                    console.log("msg ", message)
                    this.messages.push(message);
                })
            }

            this.websocket.onclose = () => {
                this.connected = false;
            }
        },

        sendMessage() {
            if (this.newMessage.trim() !== '') {
                const message = {
                    user: 'You',
                    text: this.newMessage.trim(),
                };
                this.messages.push(message);
                this.websocket.send(JSON.stringify(message));
                this.newMessage = '';
            }
        },
    },
    created() {
        this.connectWebSocket();
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
                <NavApp :floor="floor" :zone="zone" />
            </div>
        </div>
        </div>
    </div>


</template>
