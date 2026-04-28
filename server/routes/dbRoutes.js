import express from 'express';
import { deleteUser, getUserData, editUser, register } from '../controllers/dbControllers.js';

const router = express.Router();

router.post('/api/users', register);              // Create new user (registration)
router.get('/api/users/me', getUserData);         // Get current user profile
router.put('/api/users/me', editUser);            // Update current user profile
router.delete('/api/users/me', deleteUser);       // Delete current user account


export default router;