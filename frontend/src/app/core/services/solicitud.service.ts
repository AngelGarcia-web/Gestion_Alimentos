import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../models/solicitud';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = environment.apiUrl + '/solicitudes';

  constructor(private http: HttpClient) {}

  obtenerMisSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/mis-solicitudes`);
  }

  obtenerSolicitudesDonante(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/mis-solicitudes-donante`);
  }

  obtenerTodas(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  crearSolicitud(solicitud: Partial<Solicitud>): Observable<any> {
    return this.http.post(this.apiUrl, solicitud);
  }

  cambiarEstado(id: number, estado: 'aprobada' | 'rechazada' | 'completada'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { estado });
  }
}