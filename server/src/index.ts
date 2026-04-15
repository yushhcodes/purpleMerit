import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import authRoute from './route/authRoute.js';
import userRoute from './route/userRoute.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://127.0.0.1:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use(errorHandler);

async function startServer() {
    await connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}

startServer();