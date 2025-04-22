import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdenProduccion } from '../../../../Interfaces/orden_produccion';
import { Producto } from '../../../../Interfaces/producto';
import { MateriaPrima } from '../../../../Interfaces/materia_prima';
import { OrdenProduccionService } from '../../../../Services/orden-produccion.service';
import { ProductoService } from '../../../../Services/producto.service';
import { MateriaPrimaService } from '../../../../Services/materia-prima.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-modal-orden-produccion',
  standalone: false,
  templateUrl: './modal-orden-produccion.component.html',
  styleUrl: './modal-orden-produccion.component.css'
})
export class ModalOrdenProduccionComponent implements OnInit {
  formularioOrden: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaProductos: Producto[] = [];
  listaMateriaPrima: MateriaPrima[] = [];
  correoUsuario: string = "";

  constructor(
    private modalActual: MatDialogRef<ModalOrdenProduccionComponent>,
    @Inject(MAT_DIALOG_DATA) public datosOrden: OrdenProduccion,
    private fb: FormBuilder,
    private _ordenProduccionServicio: OrdenProduccionService,
    private _productoServicio: ProductoService,
    private _materiaPrimaServicio: MateriaPrimaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioOrden = this.fb.group({
      idProducto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      estado: ['iniciado', Validators.required],
      detalles: this.fb.array([])
    });

    if (this.datosOrden != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    this.obtenerUsuarioDelToken();
    this.obtenerProductosSinOrden();
    
    if (this.datosOrden != null) {
      this.formularioOrden.patchValue({
        idProducto: this.datosOrden.idProducto,
        cantidad: this.datosOrden.cantidad,
        estado: this.datosOrden.estado
      });
      this.cargarMateriaPrimaProducto(this.datosOrden.idProducto);
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

  obtenerProductosSinOrden() {
    this._productoServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          const todosProductos = response.value;
          this._ordenProduccionServicio.lista().subscribe({
            next: (ordenesResponse) => {
              if (ordenesResponse.status) {
                const productosConOrden = ordenesResponse.value.map((o: OrdenProduccion) => o.idProducto);
                this.listaProductos = todosProductos.filter((p: Producto) => !productosConOrden.includes(p.idProducto));
              }
            }
          });
        } else {
          this._utilidadServicio.mostrarAlerta("No se pudieron cargar los productos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  cargarMateriaPrimaProducto(idProducto: number) {
    this._materiaPrimaServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.listaMateriaPrima = response.value.filter((mp: MateriaPrima) => mp.idProducto === idProducto);
          this.actualizarDetalles();
        }
      },
      error: (e) => {}
    });
  }

  actualizarDetalles() {
    const detallesArray = this.formularioOrden.get('detalles') as FormArray;
    detallesArray.clear();
    
    this.listaMateriaPrima.forEach(mp => {
      detallesArray.push(this.fb.group({
        idMateriaPrima: [mp.idProducto],
        cantidad: [1, [Validators.required, Validators.min(1)]]
      }));
    });
  }

  onProductoSeleccionado() {
    const idProducto = this.formularioOrden.get('idProducto')?.value;
    if (idProducto) {
      this.cargarMateriaPrimaProducto(idProducto);
    }
  }

  get detallesArray() {
    return this.formularioOrden.get('detalles') as FormArray;
  }

  guardarEditar_Orden() {
    const _orden: OrdenProduccion = {
      idOrdenProduccion: this.datosOrden == null ? 0 : this.datosOrden.idOrdenProduccion,
      codigo: this.datosOrden == null ? this.generarCodigo() : this.datosOrden.codigo,
      idProducto: this.formularioOrden.value.idProducto,
      cantidad: this.formularioOrden.value.cantidad,
      estado: this.formularioOrden.value.estado,
      fechaRegistro: this.datosOrden == null ? new Date().toISOString() : this.datosOrden.fechaRegistro,
      usuario: this.correoUsuario,
      detalleOrdenProduccion: this.detallesArray.value.map((detalle: any) => ({
        idDetalle: 0,
        idProduccion: 0,
        idMateriaPrima: detalle.idMateriaPrima,
        cantidad: detalle.cantidad
      }))
    };

    if (this.datosOrden == null) {
      this._ordenProduccionServicio.guardar(_orden).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("La orden fue registrada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la orden", "Error");
          }
        },
        error: (e) => {}
      });
    } else {
      this._ordenProduccionServicio.editar(_orden).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilidadServicio.mostrarAlerta("La orden fue actualizada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo actualizar la orden", "Error");
          }
        },
        error: (e) => {}
      });
    }
  }

  generarCodigo(): string {
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2);
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `OP-${year}${month}${day}-${random}`;
  }
}
