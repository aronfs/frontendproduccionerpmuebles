import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MateriaPrima } from '../../../../Interfaces/materia_prima';
import { Producto } from '../../../../Interfaces/producto';
import { MateriaPrimaService } from '../../../../Services/materia-prima.service';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-modal-materia-prima',
  standalone: false,
  templateUrl: './modal-materia-prima.component.html',
  styleUrl: './modal-materia-prima.component.css'
})
export class ModalMateriaPrimaComponent implements OnInit {
  formularioMateriaPrima: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaProductos: Producto[] = [];
  correoUsuario: string = "";

  constructor(
    private modalActual: MatDialogRef<ModalMateriaPrimaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosMateriaPrima: MateriaPrima,
    private fb: FormBuilder,
    private _materiaPrimaServicio: MateriaPrimaService,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioMateriaPrima = this.fb.group({
      idProducto: ['', Validators.required],
      unidadMedida: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });

    if (this.datosMateriaPrima != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    this.obtenerUsuarioDelToken();
    this.obtenerProductosSinMateriaPrima();
    
    if (this.datosMateriaPrima != null) {
      this.formularioMateriaPrima.patchValue({
        idProducto: this.datosMateriaPrima.idProducto,
        unidadMedida: this.datosMateriaPrima.unidadMedida,
        descripcion: this.datosMateriaPrima.descripcion,
        precio: this.datosMateriaPrima.precio
      });
    }
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

  obtenerProductosSinMateriaPrima() {
    this._productoServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.listaProductos = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se pudieron cargar los productos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  guardarEditar_MateriaPrima() {
    const _materiaPrima: MateriaPrima = {
      idProducto: this.formularioMateriaPrima.value.idProducto,
      nombreProducto: this.listaProductos.find(p => p.idProducto === this.formularioMateriaPrima.value.idProducto)?.nombre || '',
      unidadMedida: this.formularioMateriaPrima.value.unidadMedida,
      descripcion: this.formularioMateriaPrima.value.descripcion,
      precio: this.formularioMateriaPrima.value.precio,
      usuario: this.correoUsuario
    };

    if (this.datosMateriaPrima == null) {
      this._materiaPrimaServicio.guardar(_materiaPrima).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("La materia prima fue registrada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la materia prima", "Error");
          }
        },
        error: (e) => {}
      });
    } else {
      this._materiaPrimaServicio.editar(_materiaPrima).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("La materia prima fue actualizada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo actualizar la materia prima", "Error");
          }
        },
        error: (e) => {}
      });
    }
  }
}
