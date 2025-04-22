import { OrdenProduccionDetalle } from "./orden_produccion_detalle";

export interface OrdenProduccion {
    idOrdenProduccion: number,
    codigo: string,
    idProducto: number,
    
    cantidad: number,
    estado: string,
    fechaRegistro: string,
    usuario: string,
    detalleOrdenProduccion: OrdenProduccionDetalle[]
}
