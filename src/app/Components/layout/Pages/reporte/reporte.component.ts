import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import moment from 'moment';

import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';

import * as XLSX from 'xlsx';
import { Reporte } from '../../../../Interfaces/reporte';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
export const MY_DATA_FORMATS ={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}
@Component({
  selector: 'app-reporte',
  standalone: false,
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
  providers:[
      {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
    ]
})
export class ReporteComponent implements OnInit{

  formularioFiltro:FormGroup;
  listaVentasReporte: Reporte[]=[];
  columnasTabla:string[]=['fechaRegistro','numeroVenta','tipoPago','total','producto','cantidad','precio','totalProducto'];
  dataVentarReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator)paginacionTabla!: MatPaginator;
  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioFiltro = this.fb.group({
      
        fechaInicio:['',Validators.required],
        fechaFinal:['',Validators.required],
    })
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    this.dataVentarReporte.paginator = this.paginacionTabla;
  }

  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format("DD/MM/YYYY");
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format("DD/MM/YYYY");
    
    if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date"){
      this._utilidadServicio.mostrarAlerta("Fecha no valida","error");
      return;
    }
    this._ventaService.reporte(_fechaInicio,_fechaFin).subscribe({
      next: (data) => {
       if(data.status){
        this.listaVentasReporte = data.value;
        this.dataVentarReporte.data = data.value;
       }else{
        this.listaVentasReporte = [];
        this.dataVentarReporte.data = [];
        this._utilidadServicio.mostrarAlerta("No se encontraron datos","error");
       }
        
      },
      error: (error) => {
        this._utilidadServicio.mostrarAlerta("Error al buscar ventas","error");
      }
    })
  }


  exportarExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);
    XLSX.utils.book_append_sheet(wb,ws,'Reporte de ventas');
    XLSX.writeFile(wb,'reporte_ventas.xlsx');
  }
}
