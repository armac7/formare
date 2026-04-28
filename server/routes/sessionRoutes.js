import express from 'express';
import { loggedIn } from '../middleware/session.js';

const router = express.Router();

router.get('/api/auth/status', loggedIn);

export default router;