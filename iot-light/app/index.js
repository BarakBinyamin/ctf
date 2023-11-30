const express = require('express')
const qrcode  = require('qrcode-terminal')
const os      = require("os")

const HOSTNAME  = os.hostname()
const PORT      = 80
const app       = express()
const expressWs = require('express-ws')(app)

// Handle websocket connections from UI and devices
const clients = expressWs.getWss('/').clients
app.ws('/', function(ws, req) {
    ws.id = req.query?.id

    if (ws.id.includes("client")){
        console.log("Client connected")
        
        ws.on('message', function(msg) {
            const message = JSON.parse(msg)
            if (message && message?.type!=undefined){
                if (message.type=="status"){
                    // Request status report from all devices
                    clients.forEach(client=>{
                        if (client.id?.includes('device')){
                            client.send(msg)
                        }
                    })
                }
                else if (message.type=="change"){
                    // Request change to all devices
                    clients.forEach(client=>{
                        if (client.id?.includes('device')){
                            client.send(msg)
                        }
                    })
                }
            }else{
                console.log("Poorly formatted message")
            }
        })

    }else if(ws.id.includes("device")){
        console.log("Device connected")

        ws.on('message', function(msg) {
            const message = JSON.parse(msg)
            if (message && message?.type!=undefined){
                if (message.type=="status"){
                    clients.forEach(client=>{
                        if (client?.id?.includes('client')){
                            // Send back status report to all clients
                            client.send(msg)
                        }
                    })
                }
            }else{
                console.log("Poorly formatted message")
            }
        })

    }else{
        console.log("Unexpected connection type")
    }
})

// Serve UI
app.get('/device',(req,res)=>{
    res.sendFile('device.html',{root:'.'})
})
app.get('/*',(req,res)=>{
    res.sendFile('index.html',{root:'.'})
})

// Start server & give a QR code for the UI addi
app.listen(PORT, ()=>{
    const link = `http://${HOSTNAME}:${PORT}`
    console.log(`\nStarted app listening @${link} ...\n`)
    qrcode.generate(link,{small:true}, function (qrcode) {
        console.log(qrcode);
    })
})