import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modal-detalle-venta',
  standalone: false,
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  fechaRegistro: string = "";
  numeroDocumento: string = "";
  tipoPago: string = "";
  total: string = "";
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['descripcionProducto', 'cantidad', 'precioTexto', 'totalTexto'];
  dataSource = new MatTableDataSource<DetalleVenta>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public _venta: Venta,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("📥 Datos recibidos en el modal:", this._venta);

    if (this._venta) {
      this.asignarDatos(this._venta);
      
      if (this._venta.detalleVenta && this._venta.detalleVenta.length > 0) {
        console.log("✅ Detalles de venta antes de asignar:", this._venta.detalleVenta);
        this.detalleVenta = [...this._venta.detalleVenta]; // Clonamos el array
        this.dataSource.data = this.detalleVenta; // Asignamos a la tabla
        console.log("✅ Datos asignados a dataSource:", this.dataSource.data);
      } else {
        console.warn("⚠ No hay detalles de venta disponibles.");
      }
    } else {
      console.error("❌ No se recibió ninguna venta.");
    }

    this.cd.detectChanges(); // Forzar actualización de la vista
  }

  asignarDatos(venta: Venta): void {
    this.fechaRegistro = venta.fechaRegistro ?? "";
    this.numeroDocumento = venta.numeroDocumento ?? "";
    this.tipoPago = venta.tipoPago ?? "";
    this.total = venta.totalTexto ?? "";
  }
}
