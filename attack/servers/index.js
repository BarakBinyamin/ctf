const express = require(`express`)
const https   = require(`https`)
const http    = require(`http`)
const fs      = require(`fs`)

const ip        = require("ip")
const ADDRESS   = ip.address()
const PORT      = 80
const qrcode    = require('qrcode-terminal')

const credentials = { key: fs.readFileSync(`${__dirname}/keys/key.pem`), cert: fs.readFileSync(`${__dirname}/keys/cert.pem`), passphrase: 'abcdef'}

const app = express()

app.get('/version',(req,res)=>{
  res.send(`1000`);
})
app.get('*',(req,res)=>{
  res.sendFile('dist/red-firmware.bin', {root: `${__dirname}`})
})

let normalServer = http.createServer(app)
let secureServer = https.createServer(credentials, app)

normalServer.listen(80,()=>{
  const link1 = `http://${ADDRESS}:${PORT}` 
  console.log(`\nStarted bad firmware server @${link1}\n`)
  qrcode.generate(link1,{small:true}, function (qrcode) {
      console.log(qrcode);
  })
})

secureServer.listen(443,()=>{
  console.log("Also listening for requests on port 443...")
})
