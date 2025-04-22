import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { TallerComponent } from './Pages/taller/taller.component';
import { ModalTallerComponent } from './Modales/modal-taller/modal-taller.component';
import { BodegaComponent } from './Pages/bodega/bodega.component';
import { ModalBodegaComponent } from './Modales/modal-bodega/modal-bodega.component';
import { ModalTipoMuebleComponent } from './Modales/modal-tipo-mueble/modal-tipo-mueble.component';
import { TipoMuebleComponent } from './Pages/tipo-mueble/tipo-mueble.component';
import { TrazabilidadComponent } from './Pages/trazabilidad/trazabilidad.component';
import { ModalTrazabilidadComponent } from './Modales/modal-trazabilidad/modal-trazabilidad.component';
import { MateriaPrimaComponent } from './Pages/materia-prima/materia-prima.component';
import { ModalMateriaPrimaComponent } from './Modales/modal-materia-prima/modal-materia-prima.component';
import { ModalOrdenProduccionComponent } from './Modales/modal-orden-produccion/modal-orden-produccion.component';
import { OrdenProduccionComponent } from './Pages/orden-produccion/orden-produccion.component';
import { WipComponent } from './Pages/wip/wip.component';
import { ModalWipComponent } from './Modales/modal-wip/modal-wip.component';
@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    TallerComponent,
    ModalTallerComponent,
    BodegaComponent,
    ModalBodegaComponent,
    ModalTipoMuebleComponent,
    TipoMuebleComponent,
    TrazabilidadComponent,
    ModalTrazabilidadComponent,
    MateriaPrimaComponent,
    ModalMateriaPrimaComponent,
    ModalOrdenProduccionComponent,
    OrdenProduccionComponent,
    WipComponent,
    ModalWipComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
