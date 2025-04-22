import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalBodegaComponent } from '../../Modales/modal-bodega/modal-bodega.component';
import { Bodega } from '../../../../Interfaces/bodega';
import { BodegaService } from '../../../../Services/bodega.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bodega',
  standalone: false,
  templateUrl: './bodega.component.html',
  styleUrl: './bodega.component.css'
})
export class BodegaComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['nombre', 'ubicacion', 'fechaRegistro', 'acciones'];
  dataInicio: Bodega[] = [];
  dataListaBodegas = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _bodegaServicio: BodegaService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.obtenerBodegas();
  }

  ngAfterViewInit(): void {
    this.dataListaBodegas.paginator = this.paginacionTabla;
  }

  obtenerBodegas() {
    this._bodegaServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaBodegas.data = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaBodegas.filter = filterValue.trim().toLowerCase();
  }

  nuevaBodega() {
    this.dialog.open(ModalBodegaComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerBodegas();
    });
  }

  editarBodega(bodega: Bodega) {
    this.dialog.open(ModalBodegaComponent, {
      disableClose: true,
      data: bodega
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerBodegas();
    });
  }

  eliminarBodega(bodega: Bodega) {
    Swal.fire({
      title: '¿Desea eliminar la bodega?',
      text: bodega.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._bodegaServicio.eliminar(bodega.idbodega).subscribe({
          next: (response) => {
            if (response.status) {
              this._utilidadServicio.mostrarAlerta("La bodega fue eliminada", "Exito");
              this.obtenerBodegas();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar la bodega", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }
}
