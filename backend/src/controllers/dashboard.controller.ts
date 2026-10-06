import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware';
import db from '../config/db';

export const obtenerEstadisticas = async (req: CustomRequest, res: Response) => {
  const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;
  const id_rol = req.usuario?.id_rol || req.usuario?.rol;

  try {
    if (id_rol === 3) {
      const [totalAlimentos]: any = await db.query('SELECT COUNT(*) AS total FROM publicaciones_alimentos');
      const [totalSolicitudes]: any = await db.query('SELECT COUNT(*) AS total FROM solicitudes');
      const [solicitudesAprobadas]: any = await db.query('SELECT COUNT(*) AS total FROM solicitudes WHERE estado = "aprobada" OR estado = "completada"');
      const [totalUsuarios]: any = await db.query('SELECT COUNT(*) AS total FROM usuarios');

      return res.json({
        alimentosPublicados: totalAlimentos[0].total,
        solicitudesTotales: totalSolicitudes[0].total,
        donacionesCompletadas: solicitudesAprobadas[0].total,
        usuariosRegistrados: totalUsuarios[0].total
      });
    }

    if (id_rol === 1) {
      const [misAlimentos]: any = await db.query('SELECT COUNT(*) AS total FROM publicaciones_alimentos WHERE id_usuario_donante = ?', [id_usuario]);
      const [solicitudesRecibidas]: any = await db.query(
        'SELECT COUNT(*) AS total FROM solicitudes s JOIN publicaciones_alimentos a ON s.id_publicacion = a.id_publicacion WHERE a.id_usuario_donante = ?',
        [id_usuario]
      );
      const [entregasCompletadas]: any = await db.query(
        'SELECT COUNT(*) AS total FROM solicitudes s JOIN publicaciones_alimentos a ON s.id_publicacion = a.id_publicacion WHERE a.id_usuario_donante = ? AND s.estado = "completada"',
        [id_usuario]
      );

      return res.json({
        alimentosPublicados: misAlimentos[0].total,
        solicitudesTotales: solicitudesRecibidas[0].total,
        donacionesCompletadas: entregasCompletadas[0].total,
        usuariosRegistrados: 0
      });
    }

    const [misSolicitudes]: any = await db.query('SELECT COUNT(*) AS total FROM solicitudes WHERE id_usuario_solicitante = ?', [id_usuario]);
    const [solicitudesAprobadas]: any = await db.query('SELECT COUNT(*) AS total FROM solicitudes WHERE id_usuario_solicitante = ? AND (estado = "aprobada" OR estado = "completada")', [id_usuario]);

    res.json({
      alimentosPublicados: 0,
      solicitudesTotales: misSolicitudes[0].total,
      donacionesCompletadas: solicitudesAprobadas[0].total,
      usuariosRegistrados: 0
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener indicadores del dashboard', error: error.message });
  }
};