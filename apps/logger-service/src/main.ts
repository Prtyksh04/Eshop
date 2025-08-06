import express from 'express';
import WebSocket from 'ws';
import http from 'http';
import { consumeKafkaMessages } from './logger-consumer';

const app = express();

const wsServer = new WebSocket.Server({ noServer: true });

export const clients = new Set<WebSocket>();
wsServer.on('connection', (ws) => {
  console.log('New logger client connected');
  clients.add(ws);

  ws.on("close", () => {
    console.log("Logger client disconnected");
    clients.delete(ws);
  })
});

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit('connection', ws, request);
  });
});

server.listen(process.env.PORT || 6008, () => {
  console.log(`Listening at http://localhost:${process.env.PORT || 6008}/api`)
});

// start kafka consumer
consumeKafkaMessages();
