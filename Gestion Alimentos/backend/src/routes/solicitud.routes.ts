import { Router } from 'express';
import {
  obtenerSolicitudes,
  obtenerMisSolicitudes,
  crearSolicitud,
  cambiarEstadoSolicitud
} from '../controllers/solicitud.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// IMPORTANTE: /mis-solicitudes debe ir ANTES de / para evitar conflictos de mapeo
router.get('/mis-solicitudes', verifyToken, obtenerMisSolicitudes);
router.get('/', verifyToken, obtenerSolicitudes);

router.post('/', verifyToken, crearSolicitud);

// Soportamos tanto PUT como PATCH para cambiar el estado
router.put('/:id', verifyToken, cambiarEstadoSolicitud);
router.patch('/:id', verifyToken, cambiarEstadoSolicitud);

export default router;