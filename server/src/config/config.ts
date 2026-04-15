import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI as string,
    ACCESS_SECRET: process.env.ACCESS_SECRET as string,
    REFRESH_SECRET: process.env.REFRESH_SECRET as string,
    CLIENT_URL: process.env.CLIENT_URL,
}