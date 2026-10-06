import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware';
import db from '../config/db';

export const obtenerSolicitudes = async (req: CustomRequest, res: Response) => {
  try {
    const query = `
      SELECT s.*, a.titulo AS alimento, u.nombre_institucion AS solicitante
      FROM solicitudes s
      JOIN publicaciones_alimentos a ON s.id_publicacion = a.id_publicacion
      JOIN usuarios u ON s.id_usuario_solicitante = u.id_usuario
      ORDER BY s.fecha_solicitud DESC
    `;
    const [solicitudes]: any = await db.query(query);
    res.json(solicitudes);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener las solicitudes', error: error.message });
  }
};

export const obtenerMisSolicitudes = async (req: CustomRequest, res: Response) => {
  const id_usuario_solicitante = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;

  try {
    const query = `
      SELECT s.*, a.titulo AS alimento, u.nombre_institucion AS solicitante, d.nombre_institucion AS donante
      FROM solicitudes s
      JOIN publicaciones_alimentos a ON s.id_publicacion = a.id_publicacion
      LEFT JOIN usuarios u ON s.id_usuario_solicitante = u.id_usuario
      LEFT JOIN usuarios d ON a.id_usuario_donante = d.id_usuario
      WHERE s.id_usuario_solicitante = ?
      ORDER BY s.fecha_solicitud DESC
    `;
    const [solicitudes]: any = await db.query(query, [id_usuario_solicitante]);
    res.json(solicitudes);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener tus solicitudes', error: error.message });
  }
};

export const obtenerSolicitudesDonante = async (req: CustomRequest, res: Response) => {
  const id_usuario_donante = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;

  try {
    const query = `
      SELECT s.*, a.titulo AS alimento, u.nombre_institucion AS solicitante
      FROM solicitudes s
      JOIN publicaciones_alimentos a ON s.id_publicacion = a.id_publicacion
      JOIN usuarios u ON s.id_usuario_solicitante = u.id_usuario
      WHERE a.id_usuario_donante = ?
      ORDER BY s.fecha_solicitud DESC
    `;
    const [solicitudes]: any = await db.query(query, [id_usuario_donante]);
    res.json(solicitudes);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener las solicitudes de tus alimentos', error: error.message });
  }
};

export const crearSolicitud = async (req: CustomRequest, res: Response) => {
  const { id_publicacion, mensaje } = req.body;
  const id_usuario_solicitante = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;

  try {
    const [publicacion]: any = await db.query(
      'SELECT * FROM publicaciones_alimentos WHERE id_publicacion = ?',
      [id_publicacion]
    );

    if (publicacion.length === 0) {
      return res.status(404).json({ mensaje: 'Alimento no encontrado' });
    }

    if (publicacion[0].estado?.toLowerCase() !== 'disponible') {
      return res.status(400).json({ mensaje: 'Este alimento ya no se encuentra disponible' });
    }

    const [result]: any = await db.query(
      'INSERT INTO solicitudes (id_publicacion, id_usuario_solicitante, mensaje) VALUES (?, ?, ?)',
      [id_publicacion, id_usuario_solicitante, mensaje || 'Solicitud de alimento realizada desde la plataforma']
    );

    await db.query(
      'UPDATE publicaciones_alimentos SET estado = "reservado" WHERE id_publicacion = ?',
      [id_publicacion]
    );

    res.status(201).json({
      mensaje: 'Solicitud enviada exitosamente',
      id_solicitud: result.insertId
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al enviar la solicitud', error: error.message });
  }
};

export const cambiarEstadoSolicitud = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const [solicitud]: any = await db.query(
      'SELECT * FROM solicitudes WHERE id_solicitud = ?',
      [id]
    );

    if (solicitud.length === 0) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }

    await db.query(
      'UPDATE solicitudes SET estado = ? WHERE id_solicitud = ?',
      [estado, id]
    );

    if (estado === 'rechazada') {
      await db.query(
        'UPDATE publicaciones_alimentos SET estado = "disponible" WHERE id_publicacion = ?',
        [solicitud[0].id_publicacion]
      );
    } else if (estado === 'completada') {
      await db.query(
        'UPDATE publicaciones_alimentos SET estado = "entregado" WHERE id_publicacion = ?',
        [solicitud[0].id_publicacion]
      );
    }

    res.json({ mensaje: 'Estado de la solicitud actualizado correctamente' });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al actualizar la solicitud', error: error.message });
  }
};