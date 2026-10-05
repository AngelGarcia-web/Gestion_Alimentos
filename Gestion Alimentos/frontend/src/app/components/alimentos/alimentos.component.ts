import { Component, OnInit } from '@angular/core';
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

  nuevoAlimento: Alimento = {
    titulo: '',
    descripcion: '',
    cantidad: 1,
    unidad_medida: 'kg',
    fecha_vencimiento: '',
    id_categoria: 1
  };

  mostrarFormulario: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private alimentoService: AlimentoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarAlimentos();
    this.cargarCategorias();
  }

  cargarAlimentos(): void {
    this.alimentoService.obtenerTodos().subscribe({
      next: (data) => this.alimentos = data,
      error: (err) => console.error('Error al cargar alimentos', err)
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  guardarAlimento(): void {
    if (!this.nuevoAlimento.titulo || !this.nuevoAlimento.fecha_vencimiento) {
      this.mensajeError = 'Por favor complete los campos requeridos';
      return;
    }

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

  eliminarAlimento(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar esta publicación?')) {
      this.alimentoService.eliminar(id).subscribe({
        next: () => {
          this.mensajeExito = 'Alimento eliminado';
          this.cargarAlimentos();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
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
    this.mostrarFormulario = false;
  }
}