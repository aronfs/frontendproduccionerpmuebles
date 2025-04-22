import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Rol } from '../../../../Interfaces/rol';
import { Usuario } from '../../../../Interfaces/usuario';
import { RolService } from '../../../../Services/rol.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ImagenService } from '../../../../Reutilizable/img_service';

@Component({
  selector: 'app-modal-usuario',
  standalone: false,
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css'],
})
export class ModalUsuarioComponent implements OnInit {
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaRoles: Rol[] = [];
  fotoUrl: string = ''; // Ahora guardamos la URL en lugar de Base64

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService,
    private _imagenServicio: ImagenService // Servicio para subir imágenes a imgBB
  ) {
    this.formularioUsuario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      idRol: [null, Validators.required],
      clave: ['',[Validators.required, Validators.minLength(8), this.validarContrasenaFuerte]],
      confirmarClave: ['', Validators.required],
      esActivo: ['1', Validators.required],
      foto: ['', Validators.required]
    },
    { validators: this.validarPassword });

    if (this.datosUsuario) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }

    this._rolServicio.lista().subscribe({
      next: (response) => {
        if (response.status) this.listaRoles = response.value;
      }
    });
  }
// Validar que la contraseña tenga mayúscula, minúscula, número y carácter especial
validarContrasenaFuerte(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  return strongPasswordRegex.test(value) ? null : { weakPassword: true };
}
  // Validación para confirmar contraseña
validarPassword(formGroup: FormGroup) {
  const password = formGroup.get('clave')?.value;
  const confirmPassword = formGroup.get('confirmarClave')?.value;
  
  return password === confirmPassword ? null : { passwordMismatch: true };
}

  ngOnInit(): void {
    if (this.datosUsuario) {
      const [nombre, ...apellidoArray] = this.datosUsuario.nombreCompleto.split(" ");
      const apellido = apellidoArray.join(" ");
      this.formularioUsuario.patchValue({
        nombre: nombre,
        apellido: apellido,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        confirmarClave: this.datosUsuario.clave,
        foto: this.datosUsuario.foto ,
        esActivo: this.datosUsuario.esActivo.toString(),
      });

      this.fotoUrl = this.datosUsuario.foto || '';
    }
  }

  seleccionarImagen(event: any): void {
    const archivo = event.target.files[0];
    if (!archivo) return;
  
    const formData = new FormData();
    formData.append("image", archivo);
    const url = `https://api.imgbb.com/1/upload?key=3a5bac554dfad3f333138987d7411b1a`;
  
    fetch(url, {
      method: "POST",
      body: formData, 
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.fotoUrl = data.data.url; // Guardar la URL de la imagen
          console.log("Imagen subida:", this.fotoUrl);
  
          // 🔹 Actualizar el campo 'foto' en el formulario y validar
          this.formularioUsuario.controls['foto'].setValue(this.fotoUrl);
          this.formularioUsuario.controls['foto'].updateValueAndValidity();
        } else {
          console.error("Error al subir imagen:", data);
          this._utilidadServicio.mostrarAlerta("Error al subir la imagen.", "Error");
        }
      })
      .catch(error => {
        console.error("Error en la subida:", error);
        this._utilidadServicio.mostrarAlerta("No se pudo subir la imagen.", "Error");
      });
  }
  
  guardarEditar_Usuario() {
    if (this.formularioUsuario.invalid) {
      this._utilidadServicio.mostrarAlerta('Por favor, completa todos los campos correctamente.', 'Error');
      return;
    }
  
    // Unimos nombre y apellido antes de enviarlo
    const nombreCompleto = `${this.formularioUsuario.value.nombre} ${this.formularioUsuario.value.apellido}`;
  
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario ? this.datosUsuario.idUsuario : 0,
      nombreCompleto: nombreCompleto, // Se envía el nombre unido
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: 1,
      foto: this.fotoUrl // Guardamos la URL en lugar de Base64
    };
  
    const operacion = this.datosUsuario
      ? this._usuarioServicio.editar(_usuario) // Si existe datosUsuario, edita
      : this._usuarioServicio.guardar(_usuario); // Si no, guarda uno nuevo
  
    operacion.subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadServicio.mostrarAlerta(
            `El usuario fue ${this.datosUsuario ? 'actualizado' : 'registrado'}`,
            'Éxito'
          );
          this.modalActual.close('true');
        } else {
          this._utilidadServicio.mostrarAlerta('El correo del usuario ya se encuentra registrado.', 'Error');
        }
      },
      error: (err) => {
        console.error('Error desde el backend:', err);
        let mensajeError = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  
        if (err.error && err.error.message) {
          mensajeError = err.error.message;
        }
  
        this._utilidadServicio.mostrarAlerta(mensajeError, 'Error');
      }
    });
  }
  
  
}