import express from 'express';
import { loggedIn } from '../middleware/session.js';

const router = express.Router();

router.get('/checkAuth', loggedIn);

export default router;