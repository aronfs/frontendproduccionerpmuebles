import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Taller } from '../../../../Interfaces/taller';
import { TallerService } from '../../../../Services/taller.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-taller',
     standalone: false,
  templateUrl: './modal-taller.component.html',
  styleUrl: './modal-taller.component.css'
})
export class ModalTallerComponent implements OnInit {
  formularioTaller: FormGroup;  
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalTallerComponent>,
    @Inject(MAT_DIALOG_DATA) public datosTaller: Taller,
    private fb: FormBuilder,
    private _tallerServicio: TallerService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioTaller = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      telefono: ['', Validators.required]
    });

    if (this.datosTaller != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.datosTaller != null) {
      this.formularioTaller.patchValue({
        nombre: this.datosTaller.nombre,
        descripcion: this.datosTaller.descripcion,
        ubicacion: this.datosTaller.ubicacion,
        telefono: this.datosTaller.telefono
      });
    }
  }

  guardarEditar_Taller() {
    if (this.formularioTaller.valid) {
      const taller: Taller = {
        idtaller: this.datosTaller?.idtaller || 0,
        nombre: this.formularioTaller.value.nombre!,
        descripcion: this.formularioTaller.value.descripcion!,
        ubicacion: this.formularioTaller.value.ubicacion!,
        telefono: this.formularioTaller.value.telefono!
      };

      if (this.datosTaller) {
        this._tallerServicio.editar(taller).subscribe({
          next: (response) => {
            this._utilidadServicio.mostrarAlerta("El taller fue actualizado", "Super Éxito");
            this.modalActual.close("true");
          },
          error: (error) => {
            console.error('Error al actualizar el taller:', error);
            this._utilidadServicio.mostrarAlerta("No se puede actualizar el taller", "Super Error");
          }
        });
      } else {
        this._tallerServicio.guardar(taller).subscribe({
          next: (response) => {
            this._utilidadServicio.mostrarAlerta("El taller fue registrado", "Super Éxito");
            this.modalActual.close("true");
          },
          error: (error) => {
            console.error('Error al crear el taller:', error);
            this._utilidadServicio.mostrarAlerta("No se puede registrar el taller", "Super Error");
          }
        });
      }
    }
  }
} 