import {IncomingMessage, Server, ServerResponse} from 'http';
import {Plugin, FastifyInstance} from 'fastify';
import {WebSocket} from "@clusterws/cws";

declare namespace fastifyWs {
    interface Options {
        path?: string;
        library?: string;
    }

    interface ws<T> {
        on(event: string, callback: (socket: WebSocket, req: T) => void): void;
    }
}

declare module 'fastify' {
    interface FastifyInstance<HttpServer = Server,
        HttpRequest = IncomingMessage,
        HttpResponse = ServerResponse> {
        ws: fastifyWs.ws<HttpRequest>;
    }
}

declare let fastifyWs: Plugin<Server, IncomingMessage, ServerResponse, fastifyWs.Options>;

export = fastifyWs;
