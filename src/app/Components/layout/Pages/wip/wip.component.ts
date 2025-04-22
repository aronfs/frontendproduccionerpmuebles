import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalWipComponent } from '../../Modales/modal-wip/modal-wip.component';
import { Wip } from '../../../../Interfaces/wip';
import { WipService } from '../../../../Services/wip.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import { Usuario } from '../../../../Interfaces/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wip',
  standalone: false,
  templateUrl: './wip.component.html',
  styleUrl: './wip.component.css'
})
export class WipComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['codigoOrden', 'nombreOperador', 'estado', 'fecha_inicio', 'fecha_fin', 'acciones'];
  dataInicio: Wip[] = [];
  dataListaWip = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  listaUsuarios: Usuario[] = [];

  constructor(
    private dialog: MatDialog,
    private _wipServicio: WipService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.obtenerWip();
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaWip.paginator = this.paginacionTabla;
  }

  obtenerWip() {
    this._wipServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaWip.data = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  obtenerUsuarios() {
    this._usuarioServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.listaUsuarios = response.value.filter((usuario: Usuario) => 
            usuario.rolDescripcion.toLowerCase().includes('operador')
          );
        }
      },
      error: (e) => {}
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaWip.filter = filterValue.trim().toLowerCase();
  }

  asignarOperador(wip: Wip) {
    this.dialog.open(ModalWipComponent, {
      disableClose: true,
      data: { wip, usuarios: this.listaUsuarios }
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerWip();
    });
  }

  editarWip(wip: Wip) {
    this.dialog.open(ModalWipComponent, {
      disableClose: true,
      data: { wip, usuarios: this.listaUsuarios }
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerWip();
    });
  }

  eliminarWip(wip: Wip) {
    Swal.fire({
      title: "¿Desea eliminar la asignación?",
      text: `Orden: ${wip.codigoOrden} | Operador: ${wip.nombreOperador}`,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._wipServicio.eliminar(wip.idwip).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("La asignación fue eliminada", "OK");
              this.obtenerWip();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar la asignación", "Error");
            }
          },
          error: (e) => {
            console.error("Error al eliminar asignación:", e);
            this._utilidadServicio.mostrarAlerta("Error en la solicitud", "Error");
          }
        });
      }
    });
  }
  
}
