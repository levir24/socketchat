const WebSocket = require('ws');
const express = require('express')
const amqp = require('amqplib/callback_api');
const fetch = require("node-fetch")

const PORT = 3000
const BASEURL = '/ws'

const app = express()
const httpServer = app.listen(PORT)

const wsServer = new WebSocket.Server({noServer: true }); // WebSocket server running on port 3000

const clients = []; // Array to store connected clients
var users={}
var USERLIST = []
var channel = 0
var REMOTE = "http://localhost:5173/freeloader/api/tables/"

function load_remote(url) { return fetch(url).then(data => data.json())}

async function load_tables() {
    USERLIST = await load_remote(REMOTE + 'users')
    //console.log(USERLIST) 
    open_amqp()
}

function open_amqp(){
  amqp.connect('amqp://192.168.2.124', (error0, connection) => {
    if (error0) { console.log (error0)}
    connection.createChannel( (error1, pchannel) => {
      if (error1) { console.log (error1)}
      channel = pchannel
      //console.log(USERLIST) 

      USERLIST.forEach(user => {
        console.log("create queue ",user.username)
        channel.assertQueue(user.username, {
          durable: false
        });
      })
    });
  });
}

load_tables()

httpServer.on('upgrade', (req, socket, head) => {
  console.log("Upgrading connection")                                     
  wsServer.handleUpgrade(req, socket, head, (ws) => {
    wsServer.emit('connection', ws, req)
  })
})

wsServer.on('connection', (ws) => {
    clients.push(ws); // Add the new client to the array of clients
    console.log("Clients connected ",clients.length)

    ws.on('message', (message) => {
      var msg=JSON.parse(message)
      console.log("Got message ",msg) 
      if ("register"in msg) {
        valid = USERLIST.find((user) => { return user.username == msg.user } ) 
        if (!valid) process.exit(0)    // reset on invalid user
        users[msg.user]=ws
        channel.consume(msg.user, (message) => {
          //console.log(" [x] Received %s", message.content.toString(),"for", msg.user )
          users[msg.user].send(message.content.toString())
        }, { noAck: true
      })
        //console.log ("register ",msg.user)
      } 
      if (users[msg.remuser]){
        users[msg.remuser].send(message);
      }

      channel.sendToQueue(msg.remuser, Buffer.from(message));

        // Broadcast incoming message to all clients

        if (msg.remuser == "all") clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
        // Broadcast incoming message to all clients
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        // Remove the disconnected client from the array of clients
        clients.splice(clients.indexOf(ws), 1);
    });
});

app.post(BASEURL+'/server/shutdown', (req,res) => { res.json({ rc: 0}); process.exit(1) })
app.get(BASEURL+'/server/time', function (req, res) { res.json({ servtime:  new Date().getTime() }) })