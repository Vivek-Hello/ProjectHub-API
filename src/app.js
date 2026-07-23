import express from 'express';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/health.router.js';
import authRouter from './routes/auth.router.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended=true}));
app.use(cookieParser());



app.use('/health', healthRouter);
app.use('/api/v1/auth',authRouter);



export default app;