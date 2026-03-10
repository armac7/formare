import express from 'express';
import { deleteUser, register } from '../controllers/dbControllers.js';

const router = express.Router();

router.post('/users', register);
router.delete('/users/me', deleteUser);

export default router;