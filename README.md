# 🚀 Sistema de Ventas - Frontend en Angular 19

## 🛠️ Tecnologías Utilizadas
- **Angular 19**
- **TypeScript**
- **HTML5**
- **SCSS**
- **JWT para Autenticación**
- **API hospedada en Microsoft Azure**
- **imgBB para almacenamiento de imágenes**

## 🌟 Características
- 🎨 **Modo Oscuro y Claro**: Implementado para mejorar la accesibilidad y la experiencia del usuario.
- 🔐 **Autenticación con JWT**: Seguridad mejorada con tokens de acceso y refresco.
- 🖼️ **Manejo de Imágenes**: Carga y almacenamiento de imágenes de productos y usuarios en imgBB.
- 📈 **Optimización del Código**: Aplicación de mejores prácticas para mejorar el rendimiento y mantenibilidad.
- ☁️ **Conexión con API en Azure**: Consumo eficiente de la API con CORS configurado correctamente.

---

## 📌 Código Limpio en Angular 19

### 📂 Estructura del Proyecto
```bash
src/
 ├── app/
 │   ├── components/      # Componentes reutilizables
 │   ├── pages/           # Vistas principales
 │   ├── services/        # Servicios para la lógica de negocio
 │   ├── guards/          # Guards para proteger rutas
 │   ├── interceptors/    # Interceptores para manejo de JWT y errores
 │   ├── app-routing.module.ts  # Configuración de rutas con `go_router`
 │   ├── app.module.ts          # Módulo principal
 ├── assets/                    # Imágenes y estilos globales
 ├── environments/               # Configuración de entornos (dev/prod)
```

### 🔑 Seguridad y Buenas Prácticas en Angular 19
1. **Protección de Rutas con Guards**
   ```typescript
   import { Injectable } from '@angular/core';
   import { CanActivate, Router } from '@angular/router';
   import { AuthService } from '../services/auth.service';
   
   @Injectable({ providedIn: 'root' })
   export class AuthGuard implements CanActivate {
     constructor(private authService: AuthService, private router: Router) {}
     canActivate(): boolean {
       if (this.authService.isAuthenticated()) {
         return true;
       } else {
         this.router.navigate(['/login']);
         return false;
       }
     }
   }
   ```

2. **Intercepción de Peticiones HTTP para Agregar el Token JWT**
   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
   import { AuthService } from '../services/auth.service';
   
   @Injectable()
   export class JwtInterceptor implements HttpInterceptor {
     constructor(private authService: AuthService) {}
     intercept(req: HttpRequest<any>, next: HttpHandler) {
       const token = this.authService.getToken();
       if (token) {
         req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
       }
       return next.handle(req);
     }
   }
   ```

3. **Manejo de CORS en API hospedada en Azure**
   - Configurar correctamente las reglas en el backend para permitir solicitudes desde el frontend.
   - En `program.cs` de ASP.NET Core 8:
     ```csharp
     builder.Services.AddCors(options =>
     {
         options.AddPolicy("AllowAngular",
             policy => policy.WithOrigins("https://tudominio.com")
                             .AllowAnyMethod()
                             .AllowAnyHeader()
                             .AllowCredentials());
     });
     ```

4. **Uso de Lazy Loading para mejorar el rendimiento**
   ```typescript
   const routes: Routes = [
     { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
     { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
   ];
   ```

---

## 🎯 Beneficios de Angular 19
✅ **Mejor Rendimiento**: Carga más rápida con optimización en `ChangeDetectionStrategy` y `Signal API`.
✅ **Manejo Avanzado de Estados**: Implementación más eficiente de `RxJS` y `Signals`.
✅ **Mejoras en la Seguridad**: Protección contra XSS y CSRF mejorada con `Trusted Types`.
✅ **Modularización Optimizada**: Componentes independientes y reutilizables.
✅ **Compatibilidad con TypeScript Avanzado**: Mejor integración con `ES2023` y mejoras en tipado estricto.

📌 **Este README está en constante actualización para reflejar las mejores prácticas y optimizaciones más recientes.** 🚀

