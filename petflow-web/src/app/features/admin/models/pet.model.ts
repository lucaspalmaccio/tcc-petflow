/**
* Interface que representa um Pet.
* (Espelha o PetDTO do back-end)
*/
export interface Pet {
    id: number;
nome: string;
especie: string;
raca: string;
clienteId: number;
}

/**
* DTO para criar ou atualizar um Pet.
* O ID é opcional (para criação).
*/
export interface PetDTO {
id?: number;
nome: string;
especie: string;
raca: string;
clienteId: number;
}