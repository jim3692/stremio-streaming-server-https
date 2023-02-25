const fs = require('fs')
const https = require('https')

const axios = require('axios')
const httpProxy = require('http-proxy')

const SERVER_PEM_URL = 'http://local-ip.co/cert/server.pem'
const SERVER_KEY_URL = 'http://local-ip.co/cert/server.key'

const serverPem = axios(SERVER_PEM_URL)
  .then(res => res.data)
const serverKey = axios(SERVER_KEY_URL)
  .then(res => res.data)

;(async () => {
  await Promise.all([ serverPem, serverKey ])

  const proxy = httpProxy.createProxyServer({
    target: {
      host: 'localhost',
      port: 11470
    }
  })

  const server = https.createServer({
    cert: await serverPem,
    key: await serverKey
  })

  server.on('request', function (req, res) {
    proxy.web(req, res)
  })

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head)
  })

  server.listen(process.env.HTTPS_PORT)
})()
