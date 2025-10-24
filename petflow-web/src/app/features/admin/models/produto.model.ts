/**
* Interface que representa um Produto.
* (Espelha o ProdutoDTO do back-end)
*/
export interface Produto {
    id: number;
nome: string;
descricao: string;
precoCusto: number;
precoVenda: number;
qtdEstoque: number;
}

/**
* DTO para criar ou atualizar um Produto.
*/
export interface ProdutoDTO {
id?: number;
nome: string;
descricao: string;
precoCusto: number;
precoVenda: number;
qtdEstoque: number;
}