import { Router } from 'express';
import { obtenerCategorias, obtenerCategoriaPorId } from '../controllers/categoria.controller';

const router = Router();

router.get('/', obtenerCategorias);
router.get('/:id', obtenerCategoriaPorId);

export default router;