import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../../Interfaces/usuario';
import { Rol } from '../../../../Interfaces/rol';
import { RolService } from '../../../../Services/rol.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2'
import { map,forkJoin } from 'rxjs';

@Component({
  selector: 'app-usuario',
  standalone: false,
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit, AfterViewInit{

  columnasTable: string[] = ['nombreCompleto','correo', 'rolDescripcion', 'estado', 'acciones', 'foto'];
  dataInicio:Usuario[]= [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla! : MatPaginator;
  estadoFiltro: string = 'activos';
  constructor(
    private dialog: MatDialog,
    private _rolServicio:RolService,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerUsuarios(mostrarActivos: boolean = true) {
    const servicio = mostrarActivos ? this._usuarioServicio.lista() : this._usuarioServicio.listaNoActivos();
  
    servicio.subscribe({
      next: (response) => {
        if (response.status) {
          const usuarios = response.value;
          const idRoles = [...new Set(usuarios.map((u: Usuario) => u.idRol))];
  
          // Ajustar fotos si es necesario
          usuarios.forEach((usuario: Usuario) => {
            if (usuario.foto) {
              usuario.foto = usuario.foto.replace(/^data:image\/\w+;base64,/, 'data:image/png;base64,');
            }
          });
  
          // Cargar roles
          this._rolServicio.lista().subscribe({
            next: (rolResponse) => {
              if (rolResponse.status) {
                const roles = rolResponse.value;
                usuarios.forEach((usuario: Usuario) => {
                  const rolEncontrado = roles.find((rol: Rol) => rol.idRol === usuario.idRol);
                  usuario.rolDescripcion = rolEncontrado ? rolEncontrado.nombre : 'Sin rol';
                });
  
                this.dataListaUsuarios.data = usuarios;
              }
            }
          });
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Error!!");
        }
      },
      error: (e) => {
        console.error("Error cargando usuarios", e);
      }
    });
  }
  
 

  filtrarPorEstado() {
    const mostrarActivos = this.estadoFiltro === 'activos';
    this.obtenerUsuarios(mostrarActivos);
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario() {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
        width: '400px', // Ajusta el ancho según lo necesites
        disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result === "true") {
            this.obtenerUsuarios();
        }
    });
}
  
  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent, {
   
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true")this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title: "¿Desea desactivar el usuario?",
      text: usuario.nombreCompleto,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, desactivar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue desactivado", "OK");
              this.filtrarPorEstado(); 
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo desactviar el usuario", "Error");
              
            }
          },
          error:(e)=>{

          }
        })
      }
    })
  }





  eliminarPermanenteUsuario(usuario:Usuario){
    Swal.fire({
      title: "¿Desea eliminar el usuario permanentemente?",
      text: usuario.nombreCompleto,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminarNoLogico(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado permanentemente", "OK");
              this.filtrarPorEstado(); 
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario", "Error");
              
            }
          },
          error:(e)=>{

          }
        })
      }
    })
  }




  activarUsuario(usuario:Usuario){
    Swal.fire({
      title: "¿Desea activar el usuario otra vez?",
      text: usuario.nombreCompleto,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, activar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.activarUsuario(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue activado otra vez", "OK");
              this.filtrarPorEstado(); 
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario", "Error");
              
            }
          },
          error:(e)=>{

          }
        })
      }
    })
  }

  obtenerFormatoImagen(base64: string): string {
    // Si el primer carácter es '/' es PNG, si es 'i' es JPG
    return base64.charAt(0) === '/' ? 'png' : 'jpeg';
  }


}
