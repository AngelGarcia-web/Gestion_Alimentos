import { Request, Response } from 'express';
import db from '../config/db';

export const obtenerCategorias = async (req: Request, res: Response) => {
  try {
    const [categorias]: any = await db.query('SELECT * FROM categorias');
    res.json(categorias);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message });
  }
};

export const obtenerCategoriaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows]: any = await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener la categoría', error: error.message });
  }
};