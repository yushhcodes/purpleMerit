import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { createUser, createUserValidation, deleteUser, getMe, getUser, getUsers, updateUser, updateUserValidation } from '../controller/userController.js';
import { authorize } from "../middleware/rbac.js";


const router: Router = Router();

router.use(authenticate);

router.get('/me', getMe);

router.get('/', authorize('admin', 'manager'), getUsers);
router.post('/', authorize('admin'), createUserValidation, createUser);

router.get('/:id', authorize('admin', 'manager'), getUser);
router.put('/:id', updateUserValidation, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;