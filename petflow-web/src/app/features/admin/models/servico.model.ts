/**
* Interface que representa um Serviço.
* (Espelha o ServicoDTO do back-end)
*/
export interface Servico {
    id: number;
nome: string;
descricao: string;
preco: number; // O back-end envia BigDecimal, mas o TypeScript/JSON trata como number
}

/**
* DTO para criar ou atualizar um Serviço.
*/
export interface ServicoDTO {
id?: number;
nome: string;
descricao: string;
preco: number;
}