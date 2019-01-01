'use strict'

const fp = require('fastify-plugin')

module.exports = fp((fastify, opts, next) => {
  const lib = opts.library || 'ws'

  if (lib !== 'ws' && lib !== '@clusterws/cws') return next(new Error('Invalid "library" option'))

  let WebSocketServer = require(lib)
  if (lib === 'ws') {
    WebSocketServer = WebSocketServer.Server
  }
  const wss = new WebSocketServer({
    server: fastify.server
  })

  fastify.decorate('ws', wss)

  fastify.addHook('onClose', (fastify, done) => fastify.ws.close(done))

  next()
}, {
  fastify: '1.x',
  name: 'fastify-ws'
})
