import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware';
import db from '../config/db';

export const obtenerPerfil = async (req: CustomRequest, res: Response) => {
  const id_usuario = req.usuario?.id || req.usuario?.id_usuario;

  try {
    const query = `
      SELECT u.id_usuario, u.nombre_institucion, u.email, u.telefono, u.direccion, u.foto_url, u.id_rol, r.nombre AS rol, u.fecha_registro 
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ?
    `;
    const [rows]: any = await db.query(query, [id_usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('ERROR REAL EN OBTENER PERFIL:', error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil', error: error.message });
  }
};

export const actualizarPerfil = async (req: CustomRequest, res: Response) => {
  const id_usuario = req.usuario?.id || req.usuario?.id_usuario;
  const { nombre_institucion, telefono, direccion, foto_url } = req.body;

  // <-- AÑADE ESTO PARA DEPURAR
  console.log('DATOS RECIBIDOS PARA ACTUALIZAR:', { id_usuario, nombre_institucion, telefono, direccion });

  try {
    await db.query(
      'UPDATE usuarios SET nombre_institucion = ?, telefono = ?, direccion = ?, foto_url = ? WHERE id_usuario = ?',
      [nombre_institucion, telefono, direccion, foto_url || null, id_usuario]
    );

    const queryUpdated = `
      SELECT u.id_usuario, u.nombre_institucion, u.email, u.telefono, u.direccion, u.foto_url, u.id_rol, r.nombre AS rol 
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ?
    `;
    const [rows]: any = await db.query(queryUpdated, [id_usuario]);

    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: rows[0]
    });
  } catch (error: any) {
    console.error('ERROR REAL EN ACTUALIZAR PERFIL:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil', error: error.message });
  }
};

export const listarUsuarios = async (req: CustomRequest, res: Response) => {
  try {
    const query = `
      SELECT u.id_usuario, u.nombre_institucion, u.email, u.telefono, u.direccion, u.foto_url, u.id_rol, r.nombre AS rol, u.fecha_registro 
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      ORDER BY u.fecha_registro DESC
    `;
    const [usuarios]: any = await db.query(query);
    res.json(usuarios);
  } catch (error: any) {
    console.error('ERROR REAL EN LISTAR USUARIOS:', error);
    res.status(500).json({ mensaje: 'Error al listar usuarios', error: error.message });
  }
};