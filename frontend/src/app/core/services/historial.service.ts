import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialEntrega } from '../models/historial';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = environment.apiUrl + '/historial';

  constructor(private http: HttpClient) {}

  obtenerHistorial(): Observable<HistorialEntrega[]> {
    return this.http.get<HistorialEntrega[]>(this.apiUrl);
  }

  registrarEntrega(entrega: HistorialEntrega): Observable<any> {
    return this.http.post(this.apiUrl, entrega);
  }
}