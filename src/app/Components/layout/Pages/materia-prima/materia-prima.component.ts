import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalMateriaPrimaComponent } from '../../Modales/modal-materia-prima/modal-materia-prima.component';
import { MateriaPrima } from '../../../../Interfaces/materia_prima';
import { MateriaPrimaService } from '../../../../Services/materia-prima.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-materia-prima',
  standalone: false,
  templateUrl: './materia-prima.component.html',
  styleUrl: './materia-prima.component.css'
})
export class MateriaPrimaComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['nombreProducto', 'unidadMedida', 'descripcion', 'precio', 'usuario', 'acciones'];
  dataInicio: MateriaPrima[] = [];
  dataListaMateriaPrima = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _materiaPrimaServicio: MateriaPrimaService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.obtenerMateriaPrima();
  }

  ngAfterViewInit(): void {
    this.dataListaMateriaPrima.paginator = this.paginacionTabla;
  }

  obtenerMateriaPrima() {
    this._materiaPrimaServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaMateriaPrima.data = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaMateriaPrima.filter = filterValue.trim().toLowerCase();
  }

  nuevaMateriaPrima() {
    const dialogRef = this.dialog.open(ModalMateriaPrimaComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.obtenerMateriaPrima();
      }
    });
  }

  editarMateriaPrima(materiaPrima: MateriaPrima) {
    const dialogRef = this.dialog.open(ModalMateriaPrimaComponent, {
      disableClose: true,
      data: materiaPrima
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.obtenerMateriaPrima();
      }
    });
  }

  eliminarMateriaPrima(materiaPrima: MateriaPrima) {
    Swal.fire({
      title: '¿Desea eliminar la materia prima?',
      text: materiaPrima.nombreProducto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this._materiaPrimaServicio.eliminar(materiaPrima.idProducto).subscribe({
          next: (response) => {
            if (response.status) {
              this._utilidadServicio.mostrarAlerta("La materia prima fue eliminada", "Listo!");
              this.obtenerMateriaPrima();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar la materia prima", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }
}
