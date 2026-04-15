import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];

    if(!token){
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};