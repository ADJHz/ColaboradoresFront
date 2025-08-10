import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  private apiUrl = '/api/colaboradores';
  private socket: any;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000'); // Conexión al servidor de sockets
  }

  // Método para obtener todos los colaboradores
  getColaboradores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para crear un nuevo colaborador
  crearColaborador(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  // Método para obtener un colaborador por ID
  getColaborador(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar un colaborador
  actualizarColaborador(id: number, formData: FormData): Observable<any> {
    formData.append('_method', 'PUT');
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  // Método para eliminar un colaborador
  eliminarColaborador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Métodos para escuchar eventos de sockets
  onColaboradorCreado(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('colaborador-creado', (data: any) => observer.next(data));
    });
  }

  onColaboradorActualizado(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('colaborador-actualizado', (data: any) => observer.next(data));
    });
  }

  onColaboradorEliminado(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('colaborador-eliminado', (data: any) => observer.next(data));
    });
  }
}
