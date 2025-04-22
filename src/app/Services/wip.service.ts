import { Injectable } from '@angular/core';
import { enviroment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';
import { Wip } from '../Interfaces/wip';

@Injectable({
  providedIn: 'root'
})
export class WipService {
  private urlApi:string = enviroment.endpoint+"Wip/";
  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);
  }

  asignarOperador(request:Wip):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}AsignarOperador`, request);
  }

  editar(request:Wip):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request);
  }

  eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }
}
