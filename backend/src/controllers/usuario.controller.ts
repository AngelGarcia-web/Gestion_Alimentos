import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware';
import db from '../config/db';
import bcrypt from 'bcrypt';

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

export const actualizarUsuarioPorId = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { nombre_institucion, telefono, direccion } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ mensaje: 'El ID de usuario es obligatorio' });
    }

    await db.query(
      'UPDATE usuarios SET nombre_institucion = ?, telefono = ?, direccion = ? WHERE id_usuario = ?',
      [nombre_institucion, telefono, direccion, id]
    );

    res.json({
      mensaje: 'Usuario actualizado correctamente'
    });
  } catch (error: any) {
    console.error('ERROR REAL EN ACTUALIZAR USUARIO POR ID:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

export const actualizarPasswordPorId = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    if (!id || !password) {
      return res.status(400).json({ mensaje: 'El ID y la contraseña son obligatorios' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
      [hashedPassword, id]
    );

    res.json({
      mensaje: 'Contraseña actualizada correctamente'
    });
  } catch (error: any) {
    console.error('ERROR REAL EN ACTUALIZAR PASSWORD:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la contraseña', error: error.message });
  }
};