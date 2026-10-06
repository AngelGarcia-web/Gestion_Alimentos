import { Router } from 'express';
import { obtenerHistorial } from '../controllers/historial.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, obtenerHistorial);
export default router;