import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware';
import db from '../config/db';

export const obtenerAlimentos = async (req: CustomRequest, res: Response) => {
  try {
    const query = `
      SELECT a.*, c.nombre AS categoria_nombre, u.nombre_institucion
      FROM publicaciones_alimentos a
      LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
      LEFT JOIN usuarios u ON a.id_usuario_donante = u.id_usuario
      ORDER BY a.fecha_creacion DESC
    `;
    const [alimentos]: any = await db.query(query);
    res.json(alimentos);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener los alimentos', error: error.message });
  }
};

export const obtenerMisAlimentos = async (req: CustomRequest, res: Response) => {
  const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;
  try {
    const query = `
      SELECT a.*, c.nombre AS categoria_nombre, u.nombre_institucion
      FROM publicaciones_alimentos a
      LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
      LEFT JOIN usuarios u ON a.id_usuario_donante = u.id_usuario
      WHERE a.id_usuario_donante = ?
      ORDER BY a.fecha_creacion DESC
    `;
    const [alimentos]: any = await db.query(query, [id_usuario]);
    res.json(alimentos);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener tus alimentos', error: error.message });
  }
};

export const obtenerAlimentoPorId = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT a.*, c.nombre AS categoria_nombre, u.nombre_institucion
      FROM publicaciones_alimentos a
      LEFT JOIN categorias c ON a.id_categoria = c.id_categoria
      LEFT JOIN usuarios u ON a.id_usuario_donante = u.id_usuario
      WHERE a.id_publicacion = ?
    `;
    const [rows]: any = await db.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Alimento no encontrado' });
    }
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener el alimento', error: error.message });
  }
};

export const crearAlimento = async (req: CustomRequest, res: Response) => {
  const { titulo, descripcion, cantidad, unidad_medida, fecha_vencimiento, id_categoria } = req.body;
  const id_usuario_donante = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;

  try {
    const [result]: any = await db.query(
      'INSERT INTO publicaciones_alimentos (titulo, descripcion, cantidad, unidad_medida, fecha_vencimiento, id_usuario_donante, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, cantidad, unidad_medida, fecha_vencimiento, id_usuario_donante, id_categoria]
    );

    res.status(201).json({
      mensaje: 'Publicación creada exitosamente',
      id_publicacion: result.insertId
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al crear la publicación', error: error.message });
  }
};

export const actualizarAlimento = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { titulo, descripcion, cantidad, unidad_medida, fecha_vencimiento, estado, id_categoria } = req.body;
  const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;

  try {
    const [rows]: any = await db.query('SELECT * FROM publicaciones_alimentos WHERE id_publicacion = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Alimento no encontrado' });
    }

    if (rows[0].id_usuario_donante !== id_usuario && req.usuario.rol !== 3) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar esta publicación' });
    }

    await db.query(
      'UPDATE publicaciones_alimentos SET titulo = ?, descripcion = ?, cantidad = ?, unidad_medida = ?, fecha_vencimiento = ?, estado = ?, id_categoria = ? WHERE id_publicacion = ?',
      [titulo, descripcion, cantidad, unidad_medida, fecha_vencimiento, estado || rows[0].estado, id_categoria, id]
    );

    res.json({ mensaje: 'Publicación actualizada correctamente' });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al actualizar la publicación', error: error.message });
  }
};

export const eliminarAlimento = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.usuario?.userId || req.usuario?.idUsuario;

  try {
    const [rows]: any = await db.query('SELECT * FROM publicaciones_alimentos WHERE id_publicacion = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Alimento no encontrado' });
    }

    if (rows[0].id_usuario_donante !== id_usuario && req.usuario.rol !== 3) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta publicación' });
    }

    await db.query('DELETE FROM publicaciones_alimentos WHERE id_publicacion = ?', [id]);
    res.json({ mensaje: 'Publicación eliminada correctamente' });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al eliminar la publicación', error: error.message });
  }
};