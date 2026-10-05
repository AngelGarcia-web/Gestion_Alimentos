import { Router } from 'express';
import { obtenerEstadisticas } from '../controllers/dashboard.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', verifyToken, obtenerEstadisticas);

export default router;