import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { CLIENT_URL } from './config/env.js';
import routes from './routes.js';

const app = express();

console.log('CLIENT_URL:', CLIENT_URL);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/', routes);

export default app;
