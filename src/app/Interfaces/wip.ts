export interface Wip {
    idwip: number;
    idproduccion: number;
    taller: number;
    idUsuario: number;
    estado: string;
    fecha_inicio: string; // formato: "yyyy-MM-dd"
    fecha_fin: string;    // formato: "yyyy-MM-dd"
    usuario: string | null;
    nombreOperador: string;
    codigoOrden: string;
  }
  