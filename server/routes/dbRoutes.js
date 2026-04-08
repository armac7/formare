import express from 'express';
import { getBodyStatus, editBodyStatus, deleteUser, getUserData, editUser, register } from '../controllers/dbControllers.js';

const router = express.Router();

router.post('/users', register);
router.put('/users/profile', editUser);
router.get('/users/profile', getUserData);
router.delete('/users/me', deleteUser);
router.get('/api/bodystatus', getBodyStatus);
router.post('/api/bodystatus', editBodyStatus);


export default router;