import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../environments/enviroment';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';
import { TipoMueble } from '../Interfaces/tipo_mueble';

@Injectable({
  providedIn: 'root'
})
export class TipoMuebleService {

  private urlApi:string = enviroment.endpoint+"TipoMueble/";
  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);
  }

  guardar(request:TipoMueble):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request);
  }

  editar(request:TipoMueble):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request);
  }

  eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }
}
