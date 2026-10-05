import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';

export const registrar = async (req: Request, res: Response) => {
  const { nombre_institucion, email, password, telefono, direccion, id_rol } = req.body;

  try {
    const [existente]: any = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existente.length > 0) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const rolAsignado = id_rol || 2;

    const [result]: any = await db.query(
      'INSERT INTO usuarios (nombre_institucion, email, password, telefono, direccion, id_rol) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre_institucion, email, passwordHashed, telefono, direccion, rolAsignado]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      id_usuario: result.insertId
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [rows]: any = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: usuario.id_usuario, 
        email: usuario.email, 
        id_rol: usuario.id_rol 
      },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_institucion: usuario.nombre_institucion,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        id_rol: usuario.id_rol
      }
    });
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};