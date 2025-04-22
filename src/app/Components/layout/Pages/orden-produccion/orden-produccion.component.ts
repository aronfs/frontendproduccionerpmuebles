import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalOrdenProduccionComponent } from '../../Modales/modal-orden-produccion/modal-orden-produccion.component';
import { OrdenProduccion } from '../../../../Interfaces/orden_produccion';
import { OrdenProduccionService } from '../../../../Services/orden-produccion.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orden-produccion',
  standalone: false,
  templateUrl: './orden-produccion.component.html',
  styleUrl: './orden-produccion.component.css'
})
export class OrdenProduccionComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['codigo', 'producto', 'cantidad', 'estado', 'fechaRegistro', 'usuario', 'acciones'];
  dataInicio: OrdenProduccion[] = [];
  dataListaOrdenes = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _ordenProduccionServicio: OrdenProduccionService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.obtenerOrdenesProduccion();
  }

  ngAfterViewInit(): void {
    this.dataListaOrdenes.paginator = this.paginacionTabla;
  }

  obtenerOrdenesProduccion() {
    this._ordenProduccionServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaOrdenes.data = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaOrdenes.filter = filterValue.trim().toLowerCase();
  }

  nuevaOrdenProduccion() {
    this.dialog.open(ModalOrdenProduccionComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerOrdenesProduccion();
    });
  }

  editarOrdenProduccion(orden: OrdenProduccion) {
    this.dialog.open(ModalOrdenProduccionComponent, {
      disableClose: true,
      data: orden
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerOrdenesProduccion();
    });
  }

  eliminarOrdenProduccion(orden: OrdenProduccion) {
    Swal.fire({
      title: '¿Desea eliminar la orden?',
      text: orden.codigo,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if(resultado.isConfirmed) {
        this._ordenProduccionServicio.eliminar(orden.idOrdenProduccion).subscribe({
          next: (response) => {
            if(response.status) {
              this._utilidadServicio.mostrarAlerta("La orden fue eliminada", "Listo!");
              this.obtenerOrdenesProduccion();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar la orden", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }
}
