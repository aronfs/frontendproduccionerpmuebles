import { Producto } from "./producto";

export interface TipoMueble {
    idTipoMueble: number,
    nombre: string,
    descripcion: string,
    fechaRegistro?: string,

    productos?: Producto[]
}