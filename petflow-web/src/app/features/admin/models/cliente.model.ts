import { Pet } from './pet.model';

/**
* Interface para listar Clientes.
* (Espelha o ClienteDTO de resposta do back-end)
*/
export interface Cliente {
id: number;
nome: string;
email: string;
cpf: string;
telefone: string;
endereco: string;
pets: Pet[];
}

/**
* DTO para criar um novo Cliente.
* (Espelha o ClienteDTO de requisição do back-end)
*/
export interface CreateClienteDTO {
nome: string;
email: string;
senha: string;
cpf: string;
telefone: string;
endereco?: string;
}

/**
* DTO para atualizar um Cliente.
* (Espelha o DTO de atualização do back-end)
*/
export interface UpdateClienteDTO {
nome: string;
cpf: string;
telefone: string;
endereco?: string;
}