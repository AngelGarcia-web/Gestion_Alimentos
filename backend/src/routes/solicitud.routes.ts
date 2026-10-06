import { Router } from 'express';
import { 
  obtenerSolicitudes, 
  obtenerMisSolicitudes, 
  obtenerSolicitudesDonante, 
  crearSolicitud, 
  cambiarEstadoSolicitud 
} from '../controllers/solicitud.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, obtenerSolicitudes);
router.get('/mis-solicitudes', verifyToken, obtenerMisSolicitudes);
router.get('/mis-solicitudes-donante', verifyToken, obtenerSolicitudesDonante);
router.post('/', verifyToken, crearSolicitud);
router.patch('/:id', verifyToken, cambiarEstadoSolicitud);

export default router;