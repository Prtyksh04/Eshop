import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser";
import bordyParser from "body-parser";
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import router from './routes/order.route';
import { createOrder } from './controllers/order.controller';


const app = express();


// cors
app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));

// for stripe can communicate with the server
app.post("/api/create-order", bordyParser.raw({ type: 'application/json' }), (req, res, next) => {
  (req as any).rawBody = req.body;
  next();
},
  createOrder
)
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to order-service!' });
});

//Routes

app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6004;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
