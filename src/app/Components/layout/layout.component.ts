import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../Interfaces/menu';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { UsuarioService } from '../../Services/usuario.service';
import { MenuService } from '../../Services/menu.service';
import { jwtDecode } from 'jwt-decode'; 
import { Usuario } from '../../Interfaces/usuario';
import { RolService } from '../../Services/rol.service';
@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[] = [];
  correoUsuario: string = "";
  rolUsuario: string = "";
  fotoUsuario: string | null = null;
  dataUsuario: Usuario[] = [];

  constructor(
    private router: Router,
    private _menuServicio: MenuService,
    private _usuarioServicio: UsuarioService,
    private _rolServicio: RolService,
    private _utilidadServicio: UtilidadService
  ) {}

  ngOnInit(): void {
    const token = this._utilidadServicio.obtenerToken();
    if (token) {
      try {
        const usuario: any = jwtDecode(token);  // Decodificar el token
        console.log("Correo:", usuario);
        //Mis variables 
        //Obtener los claims del payload del token
        this.correoUsuario = usuario["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
        this.rolUsuario = usuario["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        

        this._usuarioServicio.ObtenerFotoPorCorreo(this.correoUsuario).subscribe({
          next: (response) =>
            this.fotoUsuario = response.value,
          error: () => this.fotoUsuario = null
        });
        

        this._rolServicio.lista().subscribe({
          next: (response) => { 
            console.log("Roles:", response.value);
            //Recuerda si trabajas con datos int o string necesita aplicar Casting aprendido por el BANCO DEL AUSTRO
            const rolEncontrado = response.value.find((rol: any) => rol.idRol === parseInt(this.rolUsuario));
            if (rolEncontrado) {
              this.rolUsuario = rolEncontrado.nombre;
              
            }else{
              console.warn("Rol no encontrado:", this.rolUsuario);
              this.rolUsuario = "Sin rol";
            }
          },
            error: () => this.rolUsuario = "Sin rol"});


      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }

      //Encontrar el menu del usuario correspondiente tenemos que hacer lo siguiente
      this._usuarioServicio.lista().subscribe({
        next: (response) => {
          if (response.status) {
            const usuarios = response.value;
            //Encontrar el usuario por el correo
            const usuarioEncontrado = usuarios.find((usuario: Usuario) => usuario.correo === this.correoUsuario);
            if (usuarioEncontrado) {
             // this.dataUsuario = usuarioEncontrado;
              console.log("Usuario encontrado:", usuarioEncontrado.idUsuario);
              this._menuServicio.lista(usuarioEncontrado.idUsuario).subscribe({
                next: (response) => {
                  if (response.status) {
                    const ordenDeseado = [
                      "DashBoard", 
                      "Usuarios", 
                      "Productos", 
                      "Materia Prima",
                      "Tipo Mueble",
                      "Taller",
                      "Bodega",
                      "Orden Producción",
                      "Trabajo en Progreso",
                      "Trazabilidad",
                      "Venta", 
                      "Historial Ventas", 
                      "Reportes"
                    ];

this.listaMenus = response.value.sort(
  (a: Menu, b: Menu) => ordenDeseado.indexOf(a.nombre) - ordenDeseado.indexOf(b.nombre)
);
                    //this.listaMenus = menus.filter((menu: Menu) => usuarioEncontrado.idRol === menu.idRol);
                  } else {
                    this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Error!!")
                  }
                },
                error: (e) => { }
              });
            } else {
              this._utilidadServicio.mostrarAlerta("Usuario no encontrado", "Error!!")
            }
          } else {
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Error!!")
          }
        },
        error: (e) => { }
      });
    }else {
      this.cerrarSesion(); // Si no hay token, se redirige al login
    }
  }

  cerrarSesion() {
    this._utilidadServicio.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
