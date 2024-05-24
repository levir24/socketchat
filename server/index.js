const WebSocket = require('ws');
const express = require('express')

const PORT = 3000
const BASEURL = '/ws'

const app = express()
const httpServer = app.listen(PORT)

const wsServer = new WebSocket.Server({noServer: true }); // WebSocket server running on port 3000

const clients = []; // Array to store connected clients


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
      console.log("Got message ",JSON.parse(message))
        // Broadcast incoming message to all clients

        clients.forEach((client) => {
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