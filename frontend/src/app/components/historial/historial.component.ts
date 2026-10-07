import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialService } from '../../core/services/historial.service';
import { AuthService } from '../../core/services/auth.service';
import { HistorialEntrega } from '../../core/models/historial';

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

        this.historiales = datos;

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