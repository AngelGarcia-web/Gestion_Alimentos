import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlimentoService } from '../../services/alimento.service';
import { CategoriaService } from '../../services/categoria.service';
import { Alimento } from '../../models/alimento';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-alimentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alimentos.component.html',
  styleUrls: ['./alimentos.component.css']
})
export class AlimentosComponent implements OnInit {
  alimentos: Alimento[] = [];
  categorias: Categoria[] = [];
  
  filtroBusqueda: string = '';

  nuevoAlimento: Alimento = {
    titulo: '',
    descripcion: '',
    cantidad: 1,
    unidad_medida: 'kg',
    fecha_vencimiento: '',
    id_categoria: 1
  };

  mostrarFormulario: boolean = false;
  editando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private alimentoService: AlimentoService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAlimentos();
    this.cargarCategorias();
  }

  cargarAlimentos(): void {
    this.alimentoService.obtenerMisAlimentos().subscribe({
      next: (data) => {
        this.alimentos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar tus alimentos', err)
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  get alimentosFiltrados(): Alimento[] {
    if (!this.filtroBusqueda || !this.filtroBusqueda.trim()) {
      return this.alimentos;
    }
    const texto = this.filtroBusqueda.toLowerCase();
    return this.alimentos.filter(a => 
      (a.titulo && a.titulo.toLowerCase().includes(texto)) || 
      (a.categoria_nombre && a.categoria_nombre.toLowerCase().includes(texto))
    );
  }

  guardarAlimento(): void {
    if (!this.nuevoAlimento.titulo || !this.nuevoAlimento.fecha_vencimiento) {
      this.mensajeError = 'Por favor complete los campos requeridos';
      setTimeout(() => this.mensajeError = '', 3000);
      return;
    }

    if (this.editando && this.nuevoAlimento.id_publicacion) {
      this.alimentoService.actualizar(this.nuevoAlimento.id_publicacion, this.nuevoAlimento).subscribe({
        next: () => {
          this.mensajeExito = 'Publicación actualizada correctamente';
          this.resetFormulario();
          this.cargarAlimentos();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => {
          this.mensajeError = err.error?.mensaje || 'Error al actualizar el alimento';
          setTimeout(() => this.mensajeError = '', 3000);
        }
      });
    } else {
      this.alimentoService.crear(this.nuevoAlimento).subscribe({
        next: () => {
          this.mensajeExito = 'Publicación de alimento creada correctamente';
          this.resetFormulario();
          this.cargarAlimentos();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => {
          this.mensajeError = err.error?.mensaje || 'Error al guardar el alimento';
          setTimeout(() => this.mensajeError = '', 3000);
        }
      });
    }
  }

  prepararEdicion(alimento: Alimento): void {
    let fechaFormateada = '';
    if (alimento.fecha_vencimiento) {
      fechaFormateada = new Date(alimento.fecha_vencimiento).toISOString().split('T')[0];
    }

    this.nuevoAlimento = { 
      ...alimento, 
      fecha_vencimiento: fechaFormateada 
    };
    this.editando = true;
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  eliminarAlimento(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar esta publicación?')) {
      this.alimentoService.eliminar(id).subscribe({
        next: () => {
          this.mensajeExito = 'Alimento eliminado correctamente';
          this.cargarAlimentos();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetFormulario();
    }
    this.cdr.detectChanges();
  }

  private resetFormulario(): void {
    this.nuevoAlimento = {
      titulo: '',
      descripcion: '',
      cantidad: 1,
      unidad_medida: 'kg',
      fecha_vencimiento: '',
      id_categoria: 1
    };
    this.editando = false;
    this.mostrarFormulario = false;
  }
}