const express = require(`express`)
const path    = require(`path`)
const https   = require(`https`)
const http    = require(`http`)
const fs      = require(`fs`)

const credentials = { key: fs.readFileSync(`key.pem`), cert: fs.readFileSync(`cert.pem`), passphrase: 'abcdef'}

const app = express()

app.get('/*',(req,res)=>{
  res.end(`<html>Hello Casey, I am that wierd flashy light thing, hope you like me :)</html>`);
})

let normalServer = http.createServer(app)
let secureServer = https.createServer(credentials, app)

normalServer.listen(80,()=>{
  console.log("Listening for requests on port 80")
})
secureServer.listen(443,()=>{
  console.log("Listening for requests on port 443")
})
