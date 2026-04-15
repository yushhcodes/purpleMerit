import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token.js';

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  if (user.status === 'inactive') {
    res.status(403).json({ message: 'Account is inactive' });
    return;
  }

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401).json({ message: 'No refresh token' });
    return;
  }

  try {
    const { id } = verifyRefreshToken(token);
    const user = await User.findById(id);
    if (!user || user.status === 'inactive') {
      res.status(401).json({ message: 'User not found or inactive' });
      return;
    }

    const accessToken = signAccessToken(user.id, user.role);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};