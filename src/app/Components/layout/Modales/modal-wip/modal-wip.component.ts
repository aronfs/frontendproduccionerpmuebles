import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Wip } from '../../../../Interfaces/wip';
import { Usuario } from '../../../../Interfaces/usuario';
import { WipService } from '../../../../Services/wip.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from '../../../../Services/usuario.service';
import { RolService } from '../../../../Services/rol.service';
import { Rol } from '../../../../Interfaces/rol';

@Component({
  selector: 'app-modal-wip',
  standalone: false,
  templateUrl: './modal-wip.component.html',
  styleUrl: './modal-wip.component.css'
})
export class ModalWipComponent implements OnInit {
  formularioWip: FormGroup;
  tituloAccion: string = "Asignar";
  botonAccion: string = "Guardar";
  listaUsuarios: Usuario[] = [];
  correoUsuario: string = "";

  constructor(
    private modalActual: MatDialogRef<ModalWipComponent>,
    @Inject(MAT_DIALOG_DATA) public datosWip: { wip: Wip },
    private fb: FormBuilder,
    private _wipServicio: WipService,
    private _usuarioServicio: UsuarioService,
    private _rolServicio: RolService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioWip = this.fb.group({
      idUsuario: ['', Validators.required],
      estado: ['iniciado', Validators.required],
      fecha_inicio: [new Date().toISOString().split('T')[0], Validators.required],
      fecha_fin: ['', Validators.required]
    });

    if (this.datosWip.wip != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    this.obtenerUsuarioDelToken();
   
    this.obtenerUsuariosEmpleado();


    if (this.datosWip.wip != null) {
      this.formularioWip.patchValue({
        idUsuario: this.datosWip.wip.idUsuario,
        estado: this.datosWip.wip.estado,
        fecha_inicio: this.datosWip.wip.fecha_inicio,
        fecha_fin: this.datosWip.wip.fecha_fin
      });
    }
  }

  obtenerUsuariosEmpleado() {
    this._usuarioServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          const usuarios = response.value;

          usuarios.forEach((usuario: Usuario) => {
            if (usuario.foto) {
              usuario.foto = usuario.foto.replace(/^data:image\/\w+;base64,/, 'data:image/png;base64,');
            }
          });

          this._rolServicio.lista().subscribe({
            next: (rolResponse) => {
              if (rolResponse.status) {
                const roles = rolResponse.value;

                this.listaUsuarios = usuarios
                  .map((usuario: Usuario) => {
                    const rol = roles.find((r: Rol) => r.idRol === usuario.idRol);
                    return {
                      ...usuario,
                      rolDescripcion: rol ? rol.nombre : 'Sin rol'
                    };
                  })
                  .filter((usuario: Usuario) =>
                    usuario.rolDescripcion.toLowerCase().includes('empleado')
                  );
              }
            },
            error: (e) => console.error('Error al cargar roles', e)
          });
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron usuarios", "Error!!");
        }
      },
      error: (e) => console.error("Error cargando usuarios", e)
    });
  }
  obtenerUsuarioDelToken() {
    const token = this._utilidadServicio.obtenerToken();
    if (token) {
      try {
        const usuario: any = jwtDecode(token);
        this.correoUsuario = usuario["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }

  guardarEditar_Wip() {
    const _wip: Wip = {
      idwip: this.datosWip.wip == null ? 0 : this.datosWip.wip.idwip,
      idproduccion: this.datosWip.wip.idproduccion,
      taller: this.datosWip.wip.taller,
      idUsuario: this.formularioWip.value.idUsuario,
      estado: this.formularioWip.value.estado,
      fecha_inicio: this.formularioWip.value.fecha_inicio,
      fecha_fin: this.formularioWip.value.fecha_fin,
      usuario: this.correoUsuario,
      nombreOperador: this.listaUsuarios.find(u => u.idUsuario === this.formularioWip.value.idUsuario)?.nombreCompleto || '',
      codigoOrden: this.datosWip.wip.codigoOrden
    };

    if (this.datosWip.wip == null) {
      this._wipServicio.asignarOperador(_wip).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("El operador fue asignado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo asignar el operador", "Error");
          }
        },
        error: (e) => {}
      });
    } else {
      this._wipServicio.editar(_wip).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("La asignación fue actualizada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo actualizar la asignación", "Error");
          }
        },
        error: (e) => {}
      });
    }
  }
}
