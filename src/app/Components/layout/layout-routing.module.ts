import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { TallerComponent } from './Pages/taller/taller.component';
import { BodegaComponent } from './Pages/bodega/bodega.component';
import { TipoMuebleComponent } from './Pages/tipo-mueble/tipo-mueble.component';
import { TrazabilidadComponent } from './Pages/trazabilidad/trazabilidad.component';
import { MateriaPrimaComponent } from './Pages/materia-prima/materia-prima.component';
import { OrdenProduccionComponent } from './Pages/orden-produccion/orden-produccion.component';
import { WipComponent } from './Pages/wip/wip.component';

const routes: Routes = [{
  path: "",
  component: LayoutComponent,
  children: [
    {path: "dashboard", component: DashBoardComponent},
    {path: 'usuarios', component:UsuarioComponent},
    {path: 'productos', component:ProductoComponent},
    {path: 'venta', component:VentaComponent},
    {path: 'historial_venta', component:HistorialVentaComponent},
    {path: 'reportes', component:ReporteComponent},
    {path: 'taller', component:TallerComponent},
    {path: 'bodega', component:BodegaComponent},
    {path: 'tipo_mueble', component:TipoMuebleComponent},
    {path: 'trazabilidad', component:TrazabilidadComponent},
    {path: 'materia_prima', component:MateriaPrimaComponent},
    {path: 'orden_produccion', component:OrdenProduccionComponent},
    {path: 'wip', component:WipComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
