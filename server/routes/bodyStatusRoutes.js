import express from 'express';
import { getMonthStatus, editBodyStatus } from '../controllers/bodyStatusController.js';

const router = express.Router();

router.get('/api/month-info', getMonthStatus);
router.post('/api/bodystatus', editBodyStatus);

export default router;