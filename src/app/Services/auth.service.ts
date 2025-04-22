import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../environments/enviroment';
import { ResponseApi } from '../Interfaces/response-api';
import { Usuario } from '../Interfaces/usuario';
import { Login } from '../Interfaces/login';
import { UserLoginModel } from '../Interfaces/user-login-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Agregamos el endpoint de la API authorizador
  private urlApi:string = enviroment.endpoint+"Auth/login";

  constructor(private http:HttpClient) { }

  //Agregamos el método para iniciar sesión
  IniciarSesionToken(request:UserLoginModel):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}`,request);
  }


}
