import { Component,OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Categoria } from '../../../../Interfaces/categoria';
import { Producto } from '../../../../Interfaces/producto';
import { CategoriaService } from '../../../../Services/categoria.service';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  standalone: false,
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css'
})
export class ModalProductoComponent implements OnInit{
    formularioProducto:FormGroup;
    tituloAccion:string = "Agregar";
    botonAccion:string = "Guardar";
    listaCategorias: Categoria[]= [];
    imagenVistaPrevia: string | null = null;
    imagenSeleccionada: File | null = null;
    fotoUrl: string = ''; //

    constructor(
       private modalActual:MatDialogRef<ModalProductoComponent>,
          @Inject(MAT_DIALOG_DATA) 
          public datosProducto: Producto,
          private fb : FormBuilder,
          private _categoriaServicio: CategoriaService,
          private _productoServicio: ProductoService,
          private _utilidadServicio: UtilidadService
    ){
      this.formularioProducto = this.fb.group({
        nombre: ['', Validators.required],
        idCategoria: ['', Validators.required],
        stock: ['', Validators.required],
        precio: ['', Validators.required],
        foto: ['', Validators.required]
      });

      if(this.datosProducto != null){
        this.tituloAccion = "Editar";
        this.botonAccion = "Actualizar"
      }
      this._categoriaServicio.lista().subscribe({
        next:(response)=>{
          if(response.status) this.listaCategorias=response.value
        },
        error:(e)=>{}
      })
    }


  ngOnInit(): void {
    if(this.datosProducto != null){
      this.formularioProducto.patchValue({
        nombre:this.datosProducto.nombre,
        idCategoria:this.datosProducto.idCategoria,
        stock:this.datosProducto.stock,
        precio:this.datosProducto.precio,
        foto: this.datosProducto.foto || ''
      });
      this.fotoUrl = this.datosProducto.foto || '';
    }
  }


guardarEditar_Producto() {
  if (this.formularioProducto.valid) {
    const producto: Producto = {
      idProducto: this.datosProducto?.idProducto || 0,
      nombre: this.formularioProducto.value.nombre!,
      idCategoria: Number(this.formularioProducto.value.idCategoria),
      stock: Number(this.formularioProducto.value.stock),
      precio: this.formularioProducto.value.precio!.toString(),
      foto: this.fotoUrl || '',
      esActivo: 1, // Siempre activo por defecto
      descripcionCategoria: this.listaCategorias.find(c => c.idCategoria === Number(this.formularioProducto.value.idCategoria))?.nombre || ''
    };

    if (this.datosProducto) {
      this._productoServicio.editar(producto).subscribe({
        next: (response) => {
          this._utilidadServicio.mostrarAlerta("El producto fue actualizado", "Super Éxito");
          this.modalActual.close("true");
        },
        error: (error) => {
          console.error('Error al actualizar el producto:', error);
          this._utilidadServicio.mostrarAlerta("No se puede actualizar el producto", "Super Error");
        }
      });
    } else {
      this._productoServicio.guardar(producto).subscribe({
        next: (response) => {
          this._utilidadServicio.mostrarAlerta("El producto fue registrado", "Super Éxito");
          this.modalActual.close("true");
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          this._utilidadServicio.mostrarAlerta("No se puede registrar el producto", "Super Error");
        }
      });
    }
  }
}

seleccionarImagen(event: any): void {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const formData = new FormData();
  formData.append("image", archivo);
  const url = `https://api.imgbb.com/1/upload?key=3a5bac554dfad3f333138987d7411b1a`;
  
  
  fetch(url, {
    method: "POST",
    body: formData, // No envíes headers extras como Authorization
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.fotoUrl = data.data.url; // Guardar la URL de la imagen
        console.log("Imagen subida:", this.fotoUrl);
      } else {
        console.error("Error al subir imagen:", data);
      }
    })
    .catch(error => console.error("Error en la subida:", error));
}
}
