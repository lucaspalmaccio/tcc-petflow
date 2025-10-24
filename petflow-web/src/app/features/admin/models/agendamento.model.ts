import { Servico } from './servico.model';

// DTO para a requisição de criação (espelha o back-end)
export interface AgendamentoRequestDTO {
clienteId: number | null; // Admin que informa, cliente não
petId: number;
dataHora: string; // Formato ISO (ex: 2025-10-22T14:00:00)
  servicoIds: number[];
}

// Interface para a resposta (espelha o back-end)
export interface AgendamentoResponse {
  id: number;
  dataHora: string;
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
  valorTotal: number;
  cliente: {
    id: number;
    nome: string;
  };
  pet: {
    id: number;
    nome: string;
  };
  servicos: Servico[]; // Reutiliza o modelo de Servico
}
