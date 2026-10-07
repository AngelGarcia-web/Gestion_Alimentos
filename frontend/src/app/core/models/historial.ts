export interface HistorialEntrega {
  id_historial?: number;
  id_solicitud?: number;
  id_publicacion?: number;
  alimento?: string;
  titulo?: string;
  cantidad?: number;
  unidad_medida?: string;
  solicitante?: string;
  beneficiario?: string;
  donante?: string;
  fecha_entrega?: Date | string;
  fecha_solicitud?: Date | string;
  observaciones?: string;
  mensaje?: string;
  estado?: string;
  confirmado_por_beneficiario?: boolean | number;
}