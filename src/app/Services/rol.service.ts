import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../environments/enviroment';
import { ResponseApi } from '../Interfaces/response-api';


@Injectable({
  providedIn: 'root'
})
export class RolService {

  private urlApi:string = enviroment.endpoint+"Rol/";
  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);
  }


  ObtenerRolNombre(idRol:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ObtenerRolNombre/${idRol}`);
  }


}
