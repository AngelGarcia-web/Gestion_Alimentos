import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../models/solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:3000/api/solicitudes';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las solicitudes del usuario logueado (Beneficiario)
   * Si en tu backend usas /mis-solicitudes o /usuario, ajústalo según tu API.
   */
  obtenerMisSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/mis-solicitudes`);
  }

  /**
   * Obtener todas las solicitudes (útil para Donantes o Admins)
   */
  obtenerTodas(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  /**
   * Crea la solicitud de un alimento.
   */
  crearSolicitud(solicitud: Partial<Solicitud>): Observable<any> {
    return this.http.post(this.apiUrl, solicitud);
  }

  /**
   * Cambia el estado de la solicitud ('aprobada' | 'rechazada' | 'completada')
   */
  cambiarEstado(id: number, estado: 'aprobada' | 'rechazada' | 'completada'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { estado });
  }
}