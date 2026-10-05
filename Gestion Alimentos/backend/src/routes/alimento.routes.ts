import { Router } from 'express';
import {
  obtenerAlimentos,
  obtenerAlimentoPorId,
  crearAlimento,
  actualizarAlimento,
  eliminarAlimento
} from '../controllers/alimento.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', obtenerAlimentos);
router.get('/:id', obtenerAlimentoPorId);
router.post('/', verifyToken, crearAlimento);
router.put('/:id', verifyToken, actualizarAlimento);
router.delete('/:id', verifyToken, eliminarAlimento);

export default router;