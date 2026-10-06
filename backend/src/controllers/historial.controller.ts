import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware';
import db from '../config/db';

export const obtenerHistorial = async (req: CustomRequest, res: Response) => {
  const id_usuario = req.usuario?.id || req.usuario?.id_usuario;
  const id_rol = Number(req.usuario?.id_rol);

  try {
    let query = `
      SELECT 
        s.id_solicitud AS id_historial,
        s.id_solicitud,
        a.id_publicacion,
        a.titulo AS alimento,
        a.cantidad,
        a.unidad_medida,
        COALESCE(u_sol.nombre_institucion, 'Beneficiario') AS beneficiario,
        COALESCE(u_sol.nombre_institucion, 'Solicitante general') AS solicitante,
        u_don.nombre_institucion AS donante,
        NOW() AS fecha_entrega,
        COALESCE(s.mensaje, 'Entrega registrada en el sistema') AS observaciones,
        s.estado AS estado,
        1 AS confirmado_por_beneficiario
      FROM solicitudes s
      JOIN publicaciones_alimentos a ON s.id_publicacion = a.id_publicacion
      LEFT JOIN usuarios u_sol ON s.id_usuario_solicitante = u_sol.id_usuario
      LEFT JOIN usuarios u_don ON a.id_usuario_donante = u_don.id_usuario
      WHERE LOWER(s.estado) IN ('entregado', 'completada')
    `;

    const params: any[] = [];

    if (id_rol === 1) {
      query += ` AND a.id_usuario_donante = ?`;
      params.push(id_usuario);
    } else if (id_rol === 2) {
      query += ` AND s.id_usuario_solicitante = ?`;
      params.push(id_usuario);
    }

    query += ` ORDER BY s.id_solicitud DESC`;

    const [historial]: any = await db.query(query, params);
    res.json(historial);
  } catch (error: any) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ mensaje: 'Error al obtener el historial', error: error.message });
  }
};

export const registrarEntrega = async (req: CustomRequest, res: Response) => {
  const { id_solicitud, observaciones } = req.body;

  try {
    const [result]: any = await db.query(
      'INSERT INTO historial (id_solicitud, fecha_entrega, observaciones, confirmado_por_beneficiario) VALUES (?, NOW(), ?, 1)',
      [id_solicitud, observaciones || 'Entrega registrada exitosamente']
    );

    res.status(201).json({
      mensaje: 'Entrega registrada en el historial correctamente',
      id_historial: result.insertId
    });
  } catch (error: any) {
    console.error('Error al registrar la entrega:', error);
    res.status(500).json({ mensaje: 'Error al registrar la entrega', error: error.message });
  }
};