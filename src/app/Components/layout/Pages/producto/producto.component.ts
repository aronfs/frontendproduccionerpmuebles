import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { CategoriaService } from '../../../../Services/categoria.service';	
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: false,
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'acciones', 'foto'];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _categoriaServicio: CategoriaService,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) {}

  obtenerProductos() {
    this._productoServicio.lista().subscribe({
        next: (response) => {
            if (response.status) {
                //Mis variables
                const productos = response.value;
                const idCategorias = [...new Set(productos.map((p: Producto) => p.idCategoria))];


                // Corregir prefijo duplicado
                this.dataListaProductos.data = response.value.map((producto: Producto) => {
                    if (producto.foto) {
                        // Verificar y limpiar prefijos duplicados
                        producto.foto = producto.foto.replace(/^data:image\/\w+;base64,/, 'data:image/png;base64,');
                        this._categoriaServicio.lista().subscribe({
                          next: (categoriasResponse) => {
                              if (categoriasResponse.status) {
                                  const categorias = categoriasResponse.value;
                                  productos.forEach((producto: Producto) => {
                                      const categoriaEncontrada = categorias.find((cat: any) => cat.idCategoria === producto.idCategoria);
                                      producto.descripcionCategoria = categoriaEncontrada ? categoriaEncontrada.nombre : 'Sin categoría';
                                  });
                                  this.dataListaProductos.data = productos;
                              }
                          }
                      });


                 

                    
                      }
                    return producto;
                });
            } else {
                this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Error!!")
            }
        },
        error: (e) => { }
    });
}


  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto() {
    this.dialog.open(ModalProductoComponent, { disableClose: true })
      .afterClosed().subscribe(resultado => {
        if (resultado === "true") this.obtenerProductos();
      });
  }

  editarProducto(producto: Producto) {
    this.dialog.open(ModalProductoComponent, { disableClose: true, data: producto })
      .afterClosed().subscribe(resultado => {
        if (resultado === "true") this.obtenerProductos();
      });
  }

  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productoServicio.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado", "OK");
              this.obtenerProductos();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }

  obtenerFormatoImagen(base64: string): string {
    // Si el primer carácter es '/' es PNG, si es 'i' es JPG
    return base64.charAt(0) === '/' ? 'png' : 'jpeg';
  }
}
