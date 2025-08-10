import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  private apiUrl = '/api/colaboradores';

  constructor(private http: HttpClient) { }

  // Método para obtener todos los colaboradores
  getColaboradores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para crear un nuevo colaborador
  crearColaborador(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Método para obtener un colaborador por ID
  getColaborador(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar un colaborador
  actualizarColaborador(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Método para eliminar un colaborador
  eliminarColaborador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}