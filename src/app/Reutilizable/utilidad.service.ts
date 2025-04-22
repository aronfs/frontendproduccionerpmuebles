import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar: MatSnackBar) { }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration: 5000,
     
    });
  }

  guardarSesion(sesion: Sesion) {
    //guardamos la sesion de nuestro usuario
    localStorage.setItem("sesion", JSON.stringify(sesion));
  }

  obtenerSesionUsuario(){
    const dataCadena = localStorage.getItem("sesion");
    const usuario = JSON.parse(dataCadena!);
    return usuario;

  }

  eliminarSesionUsuario(){
    localStorage.removeItem("sesion")
  }


  // Método para obtener el token del localStorage
  obtenerToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('🔐 Token obtenido:', token);
    return token;
  }


}
