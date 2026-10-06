import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil, listarUsuarios } from '../controllers/usuario.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/perfil', verifyToken, obtenerPerfil);
router.put('/perfil', verifyToken, actualizarPerfil);
router.get('/todos', verifyToken, checkRole([3]), listarUsuarios);

export default router;