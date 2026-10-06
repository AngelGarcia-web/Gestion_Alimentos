import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil, listarUsuarios, actualizarUsuarioPorId, actualizarPasswordPorId } from '../controllers/usuario.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/perfil', verifyToken, obtenerPerfil);
router.put('/perfil', verifyToken, actualizarPerfil);
router.get('/todos', verifyToken, checkRole([3]), listarUsuarios);
router.put('/:id', verifyToken, checkRole([3]), actualizarUsuarioPorId);
router.put('/:id/password', verifyToken, checkRole([3]), actualizarPasswordPorId);

export default router;