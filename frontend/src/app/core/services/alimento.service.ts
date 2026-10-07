import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alimento } from '../models/alimento';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AlimentoService {
  private apiUrl = environment.apiUrl + '/alimentos';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(this.apiUrl);
  }

  obtenerMisAlimentos(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.apiUrl}/mis-alimentos`);
  }

  obtenerPorId(id: number): Observable<Alimento> {
    return this.http.get<Alimento>(`${this.apiUrl}/${id}`);
  }

  crear(alimento: Alimento): Observable<any> {
    return this.http.post(this.apiUrl, alimento);
  }

  actualizar(id: number, alimento: Alimento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, alimento);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}