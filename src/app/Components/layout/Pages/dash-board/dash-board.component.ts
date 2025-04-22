import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { DashBoardService } from '../../../../Services/dash-board.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  standalone: false,
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit{

  totalIngresos:string="0";
  totalVentas:string="0";
  totalProductos:string="0";

  constructor(
    private _dashBoardService: DashBoardService
  ) { }

  mostrarGraficao(labelGrafico:any[],dataGrafico:any[]){
    const chartBarras = new Chart('graficoBarras',{
      type:'bar',
      data:{
        labels:labelGrafico,
        datasets:[{
          label:'# Ventas',
          data:dataGrafico,
          backgroundColor:'rgba(12, 4, 63, 0.2)',
          borderColor:'rgb(8, 2, 68)',
          borderWidth:1
        }]
      },
      options:{
        //mantainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    });
  }

  ngOnInit(): void {
   this._dashBoardService.resumen().subscribe({
    next: data => {
      if(data.status){
        this.totalIngresos = data.value.totalIngresos;
        this.totalVentas = data.value.totalVentas;
        this.totalProductos = data.value.totalProductos;

       const arrayData :any[]= data.value.ventaUltimaSemana;
       console.log(arrayData);

       const labelTemp = arrayData.map(item => item.fecha);
       const dataTemp = arrayData.map(item => item.total);

       this.mostrarGraficao(labelTemp,dataTemp);
      }
    },
    error: error => {
      console.error(error);
    }

   })
  }


  
}
