import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuarioActual: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(usuario => {
      this.usuarioActual = usuario;
      this.cdr.detectChanges(); // Forzamos la actualización inmediata de la vista
    });
  }

  logout(): void {
    this.authService.logout();
  }

  get esAdmin(): boolean {
    return this.usuarioActual?.id_rol === 3;
  }

  get esDonante(): boolean {
    return this.usuarioActual?.id_rol === 1 || this.esAdmin;
  }

  get esBeneficiario(): boolean {
    return this.usuarioActual?.id_rol === 2 || this.esAdmin;
  }
}