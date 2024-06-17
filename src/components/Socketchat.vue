<script>
import { BASEURL, baseFetch, baseReload } from "./baseManager"

export default {

  name: 'SocketChat',

  data() {
        return {
            websocket: null,
            connected: false,
            messages: [],
            newMessage: ''
        }
    },

    props: { user: String, remuser: String},

    methods: {
        login() { },
        connectWebSocket() {
            this.websocket = new WebSocket('ws://localhost:3000'); // Change URL to your WebSocket server
            this.websocket.onopen = () => {
                this.connected = true; 
                this.websocket.send(JSON.stringify({register:true,user:this.user}));
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
                    user: this.user, 
                    remuser: this.remuser.username,
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


    <main>
       <div class="card" style="background-color: lightgray; height: 30em">
            <div v-if="connected">
                <div v-for="message in messages" :key="message.id">
                    <strong>{{ message.user }}:</strong> {{ message.text }}
                </div>
                
            </div>
            <div v-else>
                <p>Connecting...</p>
            </div>
       </div> 
       <div v-if="connected">
        <input type="text" style="width: 100%" v-model="newMessage" @keyup.enter="sendMessage"
                    placeholder="Type your message...">
        </div>
    </main>
</template>

<style>
.red {
  color: red;
  background: lightgrey
}
</style>
