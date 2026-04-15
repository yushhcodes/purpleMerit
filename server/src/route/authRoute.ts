import { Router } from 'express';
import { login, loginValidation, logout, refresh } from '../controller/authController.js';

const router: Router = Router();

router.post('/login', loginValidation, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;