import { Router } from 'express';
import auditController from '../controllers/audit.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, adminOnly);

router.post('/', auditController.createLog);
router.get('/', auditController.getAllLogs);
router.get('/recent', auditController.getRecentLogs);

export default router;
