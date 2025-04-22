import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bodega } from '../../../../Interfaces/bodega';
import { BodegaService } from '../../../../Services/bodega.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-bodega',
  standalone: false,
  templateUrl: './modal-bodega.component.html',
  styleUrl: './modal-bodega.component.css'
})
export class ModalBodegaComponent implements OnInit {
  formularioBodega: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalBodegaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosBodega: Bodega,
    private fb: FormBuilder,
    private _bodegaServicio: BodegaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioBodega = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required]
    });

    if (this.datosBodega != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.datosBodega != null) {
      this.formularioBodega.patchValue({
        nombre: this.datosBodega.nombre,
        ubicacion: this.datosBodega.ubicacion
      });
    }
  }

  guardarEditar_Bodega() {
    const bodega: Bodega = {
      idbodega: this.datosBodega == null ? 0 : this.datosBodega.idbodega,
      nombre: this.formularioBodega.value.nombre,
      ubicacion: this.formularioBodega.value.ubicacion,

    };

    if (this.datosBodega == null) {
      this._bodegaServicio.guardar(bodega).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("La bodega fue registrada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la bodega", "Error");
          }
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Error al registrar la bodega", "Error");
        }
      });
    } else {
      this._bodegaServicio.editar(bodega).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("La bodega fue editada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo editar la bodega", "Error");
          }
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Error al editar la bodega", "Error");
        }
      });
    }
  }
}
