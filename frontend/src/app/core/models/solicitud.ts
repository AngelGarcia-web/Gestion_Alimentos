export interface Solicitud {
  id_solicitud?: number;
  id?: number;
  id_publicacion?: number;
  id_usuario_solicitante?: number;
  alimento?: string;
  alimento_titulo?: string;
  titulo?: string;
  solicitante?: string;
  nombre_usuario?: string;
  nombre_institucion?: string;
  mensaje?: string;
  fecha_solicitud?: Date | string;
  created_at?: Date | string;
  estado?: string;
  estado_solicitud?: string;
}