import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImagenService } from '../../services/imagen.service';

@Component({
  selector: 'app-listar-imagen',
  templateUrl: './listar-imagen.component.html',
  styleUrls: ['./listar-imagen.component.css']
})
export class ListarImagenComponent implements OnInit {

  termino = '';
  subscripcion: Subscription;
  listImagenes: any[] = [];
  loading = false;
  imagenesPorPagina = 20;
  paginaActual = 1;
  calcularTotalPaginas = 0;

  constructor(private _imagenService: ImagenService) {
    this.subscripcion = this._imagenService.getTerminoBusqueda().subscribe(data => {
      this.termino = data;
      this.paginaActual = 1;
      this.loading = true;
      this.obtenerImagenes();
    })
  }

  ngOnInit(): void {
  }
  obtenerImagenes() {
    this.loading = false
    this._imagenService.getImagenes(this.termino, this.imagenesPorPagina, this.paginaActual).subscribe(data => {
      this.loading = false

      if (data.hits.length === 0) {
        this._imagenService.setError('No encontramos ningun resultado');
        return;
      }
      this.calcularTotalPaginas = Math.ceil(data.totalHits / this.imagenesPorPagina)
      this.listImagenes = data.hits;
    }, error => {
      this.loading = false
      this._imagenService.setError('Opps Ocurrio un error')
    });
  }
  paginaAnterior(): void {
    this.paginaActual--;
    this.loading = true;
    this.listImagenes = [];
    this.obtenerImagenes();
  }
  paginaSiguiente(): void {
    this.paginaActual++;
    this.loading = true;
    this.listImagenes = [];
    this.obtenerImagenes();
  }

  paginaAnteriorClass() {
    if (this.paginaActual === 1) {
      return false
    } else {
      return true;
    }
  }

  paginaSiguienteClass() {
    if (this.paginaActual === this.calcularTotalPaginas) {
      return false
    } else {
      return true;
    }
  }
}
