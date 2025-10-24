import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Pet, PetDTO } from '../models/pet.model';

@Injectable({
providedIn: 'root'
})
export class PetService {

private apiUrl = `${environment.apiUrl}/api/pets`;

constructor(private http: HttpClient) { }

  // === INÍCIO DA ATUALIZAÇÃO SPRINT 03 ===
  /**
   * UC05 - Busca os pets do CLIENTE logado
   */
  getMeusPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/meus-pets`);
  }
  // === FIM DA ATUALIZAÇÃO SPRINT 03 ===

  /**
   * UC03 - Adicionar Pet (Admin)
   */
  createPet(pet: PetDTO): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, pet);
  }

  /**
   * UC03 - Atualizar Pet (Admin)
   */
  updatePet(id: number, pet: PetDTO): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, pet);
  }

  /**
   * UC03 - Excluir Pet (Admin)
   */
  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
