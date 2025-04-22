import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from '../../../../Services/producto.service';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

import { Producto } from '../../../../Interfaces/producto';
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';

import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-venta',
  standalone: false,
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit{

  listaProductos:Producto[] = [];
  listaProductosFiltro:Producto[] = [];
  
  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipodePagoPorDefecto: string = "Efectivo";
  totalPagar: number=0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto','cantidad','precio','total','accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  retornarProductosPorFiltro(busquedad:any):Producto[]{
    const valorBuscado = typeof busquedad === "string" ? busquedad.toLocaleLowerCase():busquedad.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb:FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    
    });

    this._productoServicio.lista().subscribe({
      next:(response)=>{
        if(response.status) {
          const lista = response.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
        
      },
      error:(e)=>{}
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    });

  }
  ngOnInit(): void {
    
  }

  mostrarProducto(producto:Producto): string{
    return producto.nombre;
  }

  productoParaVenta(event:any){
    this.productoSeleccionado = event.option.value;

  }

  agregarProductoParaVenta(){
    const _cantidad:number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad*_precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto : this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    })

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
    this.formularioProductoVenta.patchValue({
      producto:'',
      cantidad: ''
    })


  }


  eliminarProducto(detalle: DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto),
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p=> p.idProducto != detalle.idProducto);
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }
  registrarVenta() {
    if (this.listaProductosParaVenta.length === 0) {
      this._utilidadServicio.mostrarAlerta("No hay productos en la venta", "Advertencia");
      return;
    }

    this.bloquearBotonRegistrar = true;

    const request: any = {
      tipoPago: this.tipodePagoPorDefecto,
      totalTexto: String(this.totalPagar.toFixed(2)), // 🔹 Mantener string
      detalleVenta: this.listaProductosParaVenta.map(producto => ({
        idProducto: producto.idProducto,
        descripcionProducto: producto.descripcionProducto,
        cantidad: String(producto.cantidad), // 🔹 Mantener string
        precioTexto: String(producto.precioTexto), // 🔹 Mantener string
        totalTexto: String(producto.totalTexto) // 🔹 Mantener string
      }))
    };

    console.log("Request enviado:", request);

    this._ventaServicio.registrar(request)
      .pipe(finalize(() => this.bloquearBotonRegistrar = false)) // ✅ Siempre desbloquea el botón
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

            // ✅ Notificación de éxito
            Swal.fire({
              icon: 'success',
              title: 'Venta registrada',
              text: 'La venta se ha registrado correctamente.'
            });
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Error");
          }
        },
        error: (err) => {
          console.error("Error al registrar venta:", err);
          this._utilidadServicio.mostrarAlerta("Ocurrió un error inesperado", "Error");
        }
      });
}


}
