const express = require('express')
const qrcode  = require('qrcode-terminal')
const os      = require("os")

const HOSTNAME  = os.hostname()
const ip        = require("ip")
const ADDRESS   = ip.address()
const PORT      = 80
const app       = express()
const expressWs = require('express-ws')(app)

const FIRMWARE_VERSION  = 1
const FIRMWARE_BASE_URL = "https://raw.githubusercontent.com/BarakBinyamin/ctf/main/iot-light/light/releases"

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

// Serve the firmware information for updates
app.get('/version',(req,res)=>{
    res.send(`${FIRMWARE_VERSION}`);
})
app.get('/whatisthefirmwareurl',(req,res)=>{
    res.send(`${FIRMWARE_BASE_URL}/v${FIRMWARE_VERSION}.bin`);
})
// Serve UI
app.get('/device',(req,res)=>{
    // A page that acts like the iot-lamp, useful for testing
    res.sendFile('device.html',{root:`${__dirname}`})
})
app.get('/*',(req,res)=>{
    // The main UI
    res.sendFile('index.html',{root:`${__dirname}`})
})

// Start server & give a QR code for the website made from the IP address of the host
app.listen(PORT, ()=>{
    const link1 = `http://${ADDRESS}:${PORT}` 
    const link2 = `http://${HOSTNAME}:${PORT}`
    console.log(`\nStarted app listening \n\t${link1}\n\t${link2}\n`)
    qrcode.generate(link1,{small:true}, function (qrcode) {
        console.log(qrcode);
    })
})

