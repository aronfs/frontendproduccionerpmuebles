import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from '../../../../Interfaces/venta';
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
  selector: 'app-historial-venta',
  standalone: false,
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.css',
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class HistorialVentaComponent implements OnInit,AfterViewInit {


  formularioBusquedad:FormGroup;
  opcionesBusqueda: any[]=[
    {value:'fecha', descripcion:"Por Fechas"},
    {value:'numero', descripcion:"Numero Ventas"},
  ]
  columnasTabla:string[]=['fechaRegistro','numeroDocumento','tipoPago','total','accion' ]
  dataInicio: Venta[]=[];
  datosListaVenta= new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!: MatPaginator;


  constructor(
    private fb: FormBuilder,
    private dialog:MatDialog,
    private _ventaService: VentaService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioBusquedad = this.fb.group({
      buscarPor:['fecha'],
        numero:[''],
        fechaInicio:[''],
        fechaFinal:[''],
    })

    this.formularioBusquedad.get("buscarPor")?.valueChanges.subscribe(value => {
      this.formularioBusquedad.patchValue({
        numero: '',
        fechaInicio: '',
        fechaFinal: ''
      })
    })

  }
  
  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLocaleLowerCase();
  }

  buscarVentas() {
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    // Obtener valores del formulario
    const { buscarPor, fechaInicio, fechaFinal, numero } = this.formularioBusquedad.value;

    console.log("Valores del formulario antes de formatear:", this.formularioBusquedad.value);

    if (buscarPor === "fecha") {
        // Verificar si las fechas existen antes de formatearlas
        if (!fechaInicio || !fechaFinal) {
            this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas correctamente", "Error");
            return;
        }

        // Asegurarse de que las fechas sean strings formateados correctamente
        _fechaInicio = moment(fechaInicio).isValid() ? moment(fechaInicio).format("DD/MM/YYYY") : fechaInicio;
        _fechaFin = moment(fechaFinal).isValid() ? moment(fechaFinal).format("DD/MM/YYYY") : fechaFinal;

        console.log("Fecha Inicio formateada (string):", _fechaInicio);
        console.log("Fecha Fin formateada (string):", _fechaFin);
    }

    // Llamar al servicio con las fechas en formato string
    this._ventaService.historial(
        buscarPor,
        numero ? numero : null,  // Enviar null si está vacío
        _fechaInicio,
        _fechaFin
    ).subscribe({
        next: (data) => {
            console.log("Respuesta del servicio:", data);

            if (data?.status) {
                this.datosListaVenta = data.value;
            } else {
                this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Error");
            }
        },
        error: (e) => {
            console.error("Error en la petición al servicio:", e);
            this._utilidadServicio.mostrarAlerta("Ocurrió un error al obtener los datos", "Error");
        }
    });
}



  verDetalleVenta(_venta:Venta){
    
    this.dialog.open(ModalDetalleVentaComponent,{
      data: _venta,
      disableClose: true,
       width: '300vw',  // 90% del ancho de la ventana
    height: '70vh'
      
    })
  }



}
