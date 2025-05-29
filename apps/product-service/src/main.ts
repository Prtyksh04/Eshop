import express from 'express';
import './jobs/product-crone.job'
import cors from "cors";
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import router from './routes/product.routes';


const app = express();


app.use(cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
}))


app.use(express.json())
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello Product API' });
});

//Router
app.use('/api', router);

app.use(errorMiddleware);

const port = process.env.PORT || 6002;

const server = app.listen(port, () => {
    console.log(`Product service is running at http://localhost:${port}/api`);
})

server.on('error', (err) => {
    console.log("Server Error : ", err);
})