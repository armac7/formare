import express from 'express';
import { getMonthStatus, editBodyStatus } from '../controllers/bodyStatusController.js';

const router = express.Router();

router.get('/api/body-status/:year/:month', getMonthStatus);      // Get body status for a month
router.post('/api/body-status', editBodyStatus);     // Create/update body status

export default router;