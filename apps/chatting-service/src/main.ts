import express from 'express';
import cookieParser from "cookie-parser";
import { createWebSocketServer } from './websocket';
import { startConsumer } from './chat-message.consumer';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to chatting-service!' });
});

const port = process.env.PORT || 6006;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

// Websocket server
createWebSocketServer(server);

// start kafka consumer
startConsumer().catch((error: any) => {
  console.log(error);
})

server.on('error', console.error);
