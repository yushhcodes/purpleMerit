import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

export const createUserValidation = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
];

export const updateUserValidation = [
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['admin', 'manager', 'user']),
  body('status').optional().isIn(['active', 'inactive']),
];

// GET /users - admin sees all, manager sees non-admins
export const getUsers = async (req: Request, res: Response) => {
  const { role, status, search, page = '1', limit = '10' } = req.query;

  const filter: Record<string, unknown> = {};

  if (req.user!.role === 'manager') {
    filter.role = { $ne: 'admin' };
  } else {
    if (role) filter.role = role;
  }

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit as string));

  res.json({ users, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) });
};

// GET /users/:id
export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  // managers cannot see admins
  if (req.user!.role === 'manager' && user.role === 'admin') {
    res.status(403).json({ message: 'Forbidden' }); return;
  }

  res.json(user);
};

// POST /users - admin only
export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

  const { name, email, password, role, status } = req.body;

  const exists = await User.findOne({ email });
  if (exists) { res.status(409).json({ message: 'Email already in use' }); return; }

  const user = await User.create({
    name, email, password, role, status,
    createdBy: req.user!.id,
    updatedBy: req.user!.id,
  });

  const { password: _, ...userData } = user.toObject();
  res.status(201).json(userData);
};

// PUT /users/:id - admin can edit all, manager can edit non-admins, user can edit self only
export const updateUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

  const user = await User.findById(req.params.id);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  const requestingRole = req.user!.role;
  const requestingId = req.user!.id;

  // regular user can only edit themselves
  if (requestingRole === 'user' && user.id !== requestingId) {
    res.status(403).json({ message: 'Forbidden' }); return;
  }

  // manager cannot edit admins
  if (requestingRole === 'manager' && user.role === 'admin') {
    res.status(403).json({ message: 'Forbidden' }); return;
  }

  // only admin can change roles
  if (req.body.role && requestingRole !== 'admin') {
    res.status(403).json({ message: 'Only admin can change roles' }); return;
  }

  // user cannot change own role
  if (req.body.role && requestingId === user.id) {
    res.status(403).json({ message: 'Cannot change own role' }); return;
  }

  const allowed = ['name', 'email', 'status', 'role'];
  if (requestingRole === 'user') allowed.splice(allowed.indexOf('status'), 1);

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) (user as any)[field] = req.body[field];
  });

  if (req.body.password) user.password = req.body.password;
  user.updatedBy = requestingId as any;
  await user.save();

  const { password: _, ...userData } = user.toObject();
  res.json(userData);
};

// DELETE /users/:id - admin only, soft delete
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }

  if (user.id === req.user!.id) {
    res.status(400).json({ message: 'Cannot delete your own account' }); return;
  }

  user.status = 'inactive';
  user.updatedBy = req.user!.id as any;
  await user.save();

  res.json({ message: 'User deactivated' });
};

// GET /users/me
export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) { res.status(404).json({ message: 'User not found' }); return; }
  res.json(user);
};