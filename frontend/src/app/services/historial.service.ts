import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialEntrega } from '../models/historial';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'http://localhost:3000/api/historial';

  constructor(private http: HttpClient) {}

  obtenerHistorial(): Observable<HistorialEntrega[]> {
    return this.http.get<HistorialEntrega[]>(this.apiUrl);
  }

  registrarEntrega(entrega: HistorialEntrega): Observable<any> {
    return this.http.post(this.apiUrl, entrega);
  }
}