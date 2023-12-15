const express = require(`express`)
const path    = require(`path`)
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
  console.log("Recieved new request:")
  console.log(`\tOrigin: ${req.header('Origin')}`)
  console.log(`\tHost: ${req.header('Host')}`)
  console.log(`\tHostname: ${req.hostname}`)
  console.log(`\tPATH: ${req.path}`)
  res.send(`${22}`)
})
app.get('/*',(req,res)=>{
  console.log("Recieved new request:")
  console.log(`\tOrigin: ${req.header('Origin')}`)
  console.log(`\tHost: ${req.header('Host')}`)
  console.log(`\tHostname: ${req.hostname}`)
  console.log(`\tPATH: ${req.path}`)
  res.send("ok")
})

let normalServer = http.createServer(app)
let secureServer = https.createServer(credentials, app)

normalServer.listen(80,()=>{
  const link1 = `http://${ADDRESS}:${PORT}` 
  console.log(`\nStarted analysis server @${link1}, will log all traffic\n`)
  qrcode.generate(link1,{small:true}, function (qrcode) {
      console.log(qrcode);
  })
})

secureServer.listen(443,()=>{
  console.log("Also listening for requests on port 443...")
})