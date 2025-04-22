import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalTipoMuebleComponent } from '../../Modales/modal-tipo-mueble/modal-tipo-mueble.component';
import { TipoMueble } from '../../../../Interfaces/tipo_mueble';
import { TipoMuebleService } from '../../../../Services/tipo-mueble.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-mueble',
  standalone: false,
  templateUrl: './tipo-mueble.component.html',
  styleUrl: './tipo-mueble.component.css'
})
export class TipoMuebleComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['nombre', 'descripcion', 'fechaRegistro', 'acciones'];
  dataInicio: TipoMueble[] = [];
  dataListaTiposMueble = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _tipoMuebleServicio: TipoMuebleService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.obtenerTiposMueble();
  }

  ngAfterViewInit(): void {
    this.dataListaTiposMueble.paginator = this.paginacionTabla;
  }

  obtenerTiposMueble() {
    this._tipoMuebleServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaTiposMueble.data = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaTiposMueble.filter = filterValue.trim().toLowerCase();
  }

  nuevoTipoMueble() {
    this.dialog.open(ModalTipoMuebleComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerTiposMueble();
    });
  }

  editarTipoMueble(tipoMueble: TipoMueble) {
    this.dialog.open(ModalTipoMuebleComponent, {
      disableClose: true,
      data: tipoMueble
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerTiposMueble();
    });
  }

  eliminarTipoMueble(tipoMueble: TipoMueble) {
    Swal.fire({
      title: '¿Desea eliminar el tipo de mueble?',
      text: tipoMueble.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._tipoMuebleServicio.eliminar(tipoMueble.idTipoMueble).subscribe({
          next: (response) => {
            if (response.status) {
              this._utilidadServicio.mostrarAlerta("El tipo de mueble fue eliminado", "Exito");
              this.obtenerTiposMueble();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el tipo de mueble", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }
}
