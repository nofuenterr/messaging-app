import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { CLIENT_URL } from './config/env.js';
import routes from './routes.js';

const app = express();

console.log('CLIENT_URL:', CLIENT_URL);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || origin === CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/', routes);

export default app;
