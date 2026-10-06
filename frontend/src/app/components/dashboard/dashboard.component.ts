import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    alimentosPublicados: 0,
    solicitudesTotales: 0,
    donacionesCompletadas: 0,
    usuariosRegistrados: 0
  };
  cargando: boolean = true;
  mensajeError: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.dashboardService.obtenerEstadisticas().subscribe({
      next: (data) => {
        this.stats = data;
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar las métricas del sistema';
        this.cargando = false;
        console.error(err);
      }
    });
  }
}