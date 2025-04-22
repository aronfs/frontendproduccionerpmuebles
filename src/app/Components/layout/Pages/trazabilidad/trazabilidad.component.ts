import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TrazabilidadService } from '../../../../Services/trazabilidad.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-trazabilidad',
  standalone: false,
  templateUrl: './trazabilidad.component.html',
  styleUrl: './trazabilidad.component.css'
})
export class TrazabilidadComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['etapa', 'accion', 'descripcion', 'fecha', 'usuario', 'cliente'];
  dataInicio: any[] = [];
  dataListaTrazabilidad = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _trazabilidadServicio: TrazabilidadService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    this.obtenerTrazabilidad();
  }

  ngAfterViewInit(): void {
    this.dataListaTrazabilidad.paginator = this.paginacionTabla;
  }

  obtenerTrazabilidad() {
    this._trazabilidadServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataListaTrazabilidad.data = response.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaTrazabilidad.filter = filterValue.trim().toLowerCase();
  }
}
