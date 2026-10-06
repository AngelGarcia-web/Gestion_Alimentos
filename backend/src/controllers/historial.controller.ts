import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware';
import db from '../config/db';

export const obtenerHistorial = async (req: CustomRequest, res: Response) => {
  try {
    const query = `
      SELECT 
        COALESCE(s.id_solicitud, a.id_publicacion) AS id_historial,
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
        COALESCE(s.estado, a.estado) AS estado,
        1 AS confirmado_por_beneficiario
      FROM publicaciones_alimentos a
      LEFT JOIN solicitudes s ON a.id_publicacion = s.id_publicacion
      LEFT JOIN usuarios u_sol ON s.id_usuario_solicitante = u_sol.id_usuario
      LEFT JOIN usuarios u_don ON a.id_usuario_donante = u_don.id_usuario
      WHERE LOWER(a.estado) = 'entregado' 
         OR LOWER(s.estado) IN ('entregado', 'completada')
    `;

    const [historial]: any = await db.query(query);
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