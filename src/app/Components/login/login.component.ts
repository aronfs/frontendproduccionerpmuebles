import { Compiler, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { AuthService } from '../../Services/auth.service';
import { UserLoginModel } from '../../Interfaces/user-login-model';	

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authServicio: AuthService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Mejor validación del email
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Método para iniciar sesión
  iniciarSesion() {
    if (this.formularioLogin.invalid) {
      this._utilidadServicio.mostrarAlerta("Formulario inválido", "Por favor complete todos los campos.");
      return;
    }

    this.mostrarLoading = true;

    const request: UserLoginModel = {
      UserName: this.formularioLogin.value.email,
      Password: this.formularioLogin.value.password
    };

    this._authServicio.IniciarSesionToken(request).subscribe({
      next: (data) => {
       
          if(data?.token){
              console.log('✅ Token recibido:', data.token);
              localStorage.setItem('token', data.token);
              this.router.navigate(["pages/dashboard"]);
            
          } else {
              console.error('❌ Error en la respuesta del servidor:', data);
              this._utilidadServicio.mostrarAlerta("Usuario no encontrado", "Intente de nuevo.");
          }
      
      },
      error: (error) => {
        console.error('❌ Error en la petición:', error);
        if (error.status === 401) {
          this._utilidadServicio.mostrarAlerta("Acceso denegado", "Credenciales incorrectas.");
        } else if (error.status === 0) {
          this._utilidadServicio.mostrarAlerta("Error de conexión", "Verifica tu conexión a internet.");
        } else {
          this._utilidadServicio.mostrarAlerta("Error inesperado", "Por favor, inténtalo de nuevo.");
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      }
    });
  }

  
}
