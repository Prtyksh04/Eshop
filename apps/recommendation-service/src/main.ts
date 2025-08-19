import express from 'express';
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send({ message: 'Welcome to recommendation-service!' });
});

// routes

const port = process.env.PORT || 6007;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
