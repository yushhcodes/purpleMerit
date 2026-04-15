import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const signAccessToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, config.ACCESS_SECRET, { expiresIn: "15m" });
}

export const signRefreshToken = (id: string) => {
    return jwt.sign({ id }, config.REFRESH_SECRET, { expiresIn: "7d" });
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.ACCESS_SECRET) as { id: string, role: string };
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.REFRESH_SECRET) as { id: string };
}