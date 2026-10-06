import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialService } from '../../services/historial.service';
import { AuthService } from '../../services/auth.service';
import { HistorialEntrega } from '../../models/historial';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historiales: HistorialEntrega[] = [];
  cargando: boolean = true;

  constructor(
    private historialService: HistorialService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.historialService.obtenerHistorial().subscribe({
      next: (res: any) => {
        let datos: HistorialEntrega[] = [];

        if (Array.isArray(res)) {
          datos = res;
        } else if (res && Array.isArray(res.data)) {
          datos = res.data;
        } else if (res && Array.isArray(res.historial)) {
          datos = res.historial;
        }

        const usuarioActual = this.authService.getUser();
        const rolId = this.authService.getRoleId();
        
        // CORREGIDO: El administrador es el rol 3 en tu base de datos
        const esAdmin = Number(rolId) === 3;

        const nombreUsuario = (usuarioActual?.nombre_institucion || '').trim().toLowerCase();
        const idUsuario = usuarioActual?.id_usuario;

        if (!esAdmin && (nombreUsuario || idUsuario)) {
          this.historiales = datos.filter((item: any) => {
            const valSol = (item.solicitante_beneficiario || item.beneficiario || item.institucion || item.nombre_institucion || '').trim().toLowerCase();
            const valId = item.id_usuario || item.id_beneficiario;
            
            return (nombreUsuario && valSol.includes(nombreUsuario)) || (idUsuario && valId === idUsuario);
          });
        } else {
          // Si es Admin (rol 3), pasa todo el historial global sin filtrar
          this.historiales = datos;
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}