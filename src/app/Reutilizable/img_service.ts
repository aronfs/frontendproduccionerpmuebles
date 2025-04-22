import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private imgBBKey: string = '3a5bac554dfad3f333138987d7411b1a'; // Reemplázala con tu clave de API de imgBB
  private imgBBUrl = `https://api.imgbb.com/1/upload?key=${this.imgBBKey}`;

  constructor(private http: HttpClient) {}

  subirImagen(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', archivo);
    formData.append('key', this.imgBBKey);

    return this.http.post(this.imgBBUrl, formData);
  }
}
