export interface Alimento {
  id_publicacion?: number;
  titulo: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  fecha_vencimiento: string;
  estado?: 'Disponible' | 'Reservado' | 'Entregado' | 'Vencido' | 'disponible' | 'reservado' | 'entregado' | 'vencido' | string;
  id_usuario_donante?: number;
  id_categoria?: number;
  categoria_nombre?: string;
  categoria?: string;
  nombre_institucion?: string;
}