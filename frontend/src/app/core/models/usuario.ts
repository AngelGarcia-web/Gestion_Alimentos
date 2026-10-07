export interface Usuario {
  id_usuario?: number;
  nombre_institucion: string;
  email: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  foto_url?: string; 
  id_rol: number;
  rol?: string;
  fecha_registro?: string;
}