import { Response, NextFunction } from 'express';
import { CustomRequest } from './auth.middleware';

export const checkRole = (rolesPermitidos: number[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const usuario = req.usuario;

    if (!usuario || !rolesPermitidos.includes(usuario.id_rol)) {
      return res.status(403).json({ 
        mensaje: 'Acceso denegado: No tienes permisos suficientes para realizar esta acción' 
      });
    }

    next();
  };
};