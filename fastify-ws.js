"use strict";

const fp = require("fastify-plugin");

module.exports = fp((fastify, opts, next) => {
    const lib = opts.library || "ws";

    let WebSocketServer = null;
    if (lib === "ws") {
        WebSocketServer = require(lib).Server;
    } else if (lib === "@clusterws/cws") {
        WebSocketServer = require(lib).WebSocketServer;
    } else {
        return next(new Error("Invalid \"library\" option"));
    }

    const wsOpts = {
        server: fastify.server
    };
    if (opts.path !== undefined) {
        wsOpts.path = opts.path;
    }
    const wss = new WebSocketServer(wsOpts);

    fastify.decorate("ws", wss);

    fastify.addHook("onClose", (fastify, done) => fastify.ws.close(done));

    next();
}, {
    fastify: "2.x",
    name: "fastify-ws"
});
