import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalTallerComponent } from '../../Modales/modal-taller/modal-taller.component';
import { Taller } from '../../../../Interfaces/taller';
import { TallerService } from '../../../../Services/taller.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taller',
  standalone: false,
  templateUrl: './taller.component.html',
  styleUrl: './taller.component.css'
})
export class TallerComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['nombre', 'descripcion', 'ubicacion', 'telefono', 'acciones'];
  dataInicio: Taller[] = [];
  dataListaTalleres = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _tallerServicio: TallerService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.obtenerTalleres();
  }

  ngAfterViewInit(): void {
    this.dataListaTalleres.paginator = this.paginacionTabla;
  }

  obtenerTalleres() {
    this._tallerServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaTalleres.data = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Error!!");
        }
      },
      error: (e) => {
        console.error("Error cargando talleres", e);
      }
    });
  }

  nuevoTaller() {
    const dialogRef = this.dialog.open(ModalTallerComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "true") {
        this.obtenerTalleres();
      }
    });
  }

  editarTaller(taller: Taller) {
    this.dialog.open(ModalTallerComponent, {
      width: '500px',
      disableClose: true,
      data: taller
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.obtenerTalleres();
      }
    });
  }

  eliminarTaller(taller: Taller) {
    Swal.fire({
      title: '¿Desea eliminar el taller?',
      text: taller.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._tallerServicio.eliminar(taller.idtaller).subscribe({
          next: (response) => {
            if (response.status) {
              this._utilidadServicio.mostrarAlerta("El taller fue eliminado", "Éxito");
              this.obtenerTalleres();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el taller", "Error");
            }
          },
          error: (e) => {
            console.error("Error eliminando taller", e);
          }
        });
      }
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaTalleres.filter = filterValue.trim().toLowerCase();
  }
}
