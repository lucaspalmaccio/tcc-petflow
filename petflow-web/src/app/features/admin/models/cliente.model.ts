import { Pet } from './pet.model';

export interface Cliente {
id: number;
nome: string;
email: string;
cpf: string;
telefone: string;
endereco: string;
pets: Pet[];
}

export interface CreateClienteDTO {
nome: string;
email: string;
senha: string;
cpf: string;
telefone: string;
endereco?: string;
}

export interface UpdateClienteDTO {
nome: string;
cpf: string;
telefone: string;
endereco?: string;
}