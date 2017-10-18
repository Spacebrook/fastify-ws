'use strict'

const fp = require('fastify-plugin')

module.exports = fp((fastify, opts, next) => {
  const WebSocketServer = require('ws').Server
  const wss = new WebSocketServer({
    server: fastify.server
  })

  const keepAlive = ws => {
    ws.alive = true
    const stayAlive = () => { ws.alive = true }
    ws.on('pong', stayAlive)
  }

  wss.on('connection', keepAlive)

  const pingInterval = opts.pingInterval || 30000

  setInterval(() => wss.clients.forEach(ws => {
    if (ws.alive === false) return ws.terminate()
    ws.alive = false
    ws.ping('', false, true)
  }), pingInterval)

  fastify.decorate('wsServer', wss)

  next()
})
