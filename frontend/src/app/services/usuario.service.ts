import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }

  actualizarPerfil(datos: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, datos);
  }

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/todos`);
  }

  // Método para actualizar los datos de un usuario por ID (desde el panel admin)
  actualizarUsuario(id: number, datos: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  // Método específico para resetear/actualizar la contraseña de un usuario por ID
  actualizarPassword(id: number, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, { password });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}