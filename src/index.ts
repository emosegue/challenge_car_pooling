import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import carPoolingRoutes from './routes/index';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) ?? 3000;
const HOST = process.env.HOST ?? 'localhost';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('', carPoolingRoutes)

app.listen(PORT, HOST, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});