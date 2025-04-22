import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../environments/enviroment';
import { ResponseApi } from '../Interfaces/response-api';
import { Usuario } from '../Interfaces/usuario';
import { Login } from '../Interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private urlApi:string = enviroment.endpoint+"Usuario/";

  constructor(private http:HttpClient) { }

  IniciarSesion(request:Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}IniciarSesion`,request);
  }

  ObtenerFotoPorCorreo(correo:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ObtenerFotoPorCorreo/${correo}`);
  }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);
  }

  listaNoActivos():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ListaNoActivos`);
  }
  
  guardar(request:Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request);
  }

  editar(request:Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request);
  }

  eliminar(id:number):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}EliminarLogico/${id}`, null, { responseType: 'json' });
  }

  eliminarNoLogico(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }

  activarUsuario(id:number):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}ActivarUsuario/${id}`, null, { responseType: 'json' });
  }


}
