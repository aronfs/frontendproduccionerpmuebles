import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoMueble } from '../../../../Interfaces/tipo_mueble';
import { TipoMuebleService } from '../../../../Services/tipo-mueble.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-tipo-mueble',
  standalone: false,
  templateUrl: './modal-tipo-mueble.component.html',
  styleUrl: './modal-tipo-mueble.component.css'
})
export class ModalTipoMuebleComponent implements OnInit {
  formularioTipoMueble: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalTipoMuebleComponent>,
    @Inject(MAT_DIALOG_DATA) public datosTipoMueble: TipoMueble,
    private fb: FormBuilder,
    private _tipoMuebleServicio: TipoMuebleService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioTipoMueble = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    if (this.datosTipoMueble != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.datosTipoMueble != null) {
      this.formularioTipoMueble.patchValue({
        nombre: this.datosTipoMueble.nombre,
        descripcion: this.datosTipoMueble.descripcion
      });
    }
  }

  guardarEditar_TipoMueble() {
    const tipoMueble: TipoMueble = {
      idTipoMueble: this.datosTipoMueble?.idTipoMueble ?? 0,
      nombre: this.formularioTipoMueble.value.nombre,
      descripcion: this.formularioTipoMueble.value.descripcion
     
    };

    if (this.datosTipoMueble == null) {
      this._tipoMuebleServicio.guardar(tipoMueble).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("El tipo de mueble fue registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el tipo de mueble", "Error");
          }
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Error al registrar el tipo de mueble", "Error");
        }
      });
    } else {
      this._tipoMuebleServicio.editar(tipoMueble).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("El tipo de mueble fue editado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo editar el tipo de mueble", "Error");
          }
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Error al editar el tipo de mueble", "Error");
        }
      });
    }
  }
}
