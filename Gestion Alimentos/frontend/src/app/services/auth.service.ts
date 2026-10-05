import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciales: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res) => {
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user_info', JSON.stringify(res.usuario));
        this.currentUserSubject.next(res.usuario);
      })
    );
  }

  registro(datos: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  // Método para actualizar la sesión en tiempo real desde el módulo de Perfil
  actualizarUsuarioSesion(usuarioActualizado: Usuario): void {
    localStorage.setItem('user_info', JSON.stringify(usuarioActualizado));
    this.currentUserSubject.next(usuarioActualizado);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getRoleId(): number | null {
    const user = this.getUser();
    return user ? user.id_rol : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getUserFromStorage(): Usuario | null {
    const data = localStorage.getItem('user_info');
    return data ? JSON.parse(data) : null;
  }
}