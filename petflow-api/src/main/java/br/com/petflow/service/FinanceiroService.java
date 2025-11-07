package br.com.petflow.service;

import br.com.petflow.dto.DashboardResponseDTO;
import br.com.petflow.model.Agendamento;
import br.com.petflow.model.Servico;
import br.com.petflow.model.ServicoProduto;
import br.com.petflow.model.StatusAgendamento;
import br.com.petflow.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Recomendado

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
public class FinanceiroService {

    private final AgendamentoRepository agendamentoRepository;

    public FinanceiroService(AgendamentoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    /**
     * UC08 - Visualizar Dashboard Financeiro [cite: 83]
     * Calcula os principais KPIs financeiros baseados apenas em agendamentos concluídos.
     */
    @Transactional(readOnly = true) // Boa prática para métodos de leitura
    public DashboardResponseDTO getDashboard() {

        // 1. Busca APENAS os agendamentos com status "CONCLUÍDO" [cite: 197]
        List<Agendamento> concluidos = agendamentoRepository
                .findAllByStatus(StatusAgendamento.CONCLUIDO);

        BigDecimal faturamentoTotal = BigDecimal.ZERO;
        BigDecimal custoTotal = BigDecimal.ZERO;

        // 2. Itera por eles para calcular os valores
        for (Agendamento ag : concluidos) {

            // 2a. Soma o Faturamento (Preço de Venda do Agendamento) [cite: 198]
            faturamentoTotal = faturamentoTotal.add(ag.getValorTotal());

            // 2b. Soma o Custo (Preço de Custo dos Produtos) [cite: 199]
            Set<Servico> servicos = ag.getServicos();
            for (Servico s : servicos) {
                // Pega a "receita" de produtos do serviço
                Set<ServicoProduto> produtosUsados = s.getProdutosUsados();

                for (ServicoProduto sp : produtosUsados) {

                    // Pega o preço de custo de cada produto [cite: 199]
                    BigDecimal precoCustoProduto = sp.getProduto().getPrecoCusto();
                    BigDecimal quantidade = new BigDecimal(sp.getQuantidade());

                    BigDecimal custoDoItem = precoCustoProduto.multiply(quantidade);
                    custoTotal = custoTotal.add(custoDoItem);
                }
            }
        }

        // 3. Calcula o Lucro (Faturamento - Custo) [cite: 200]
        BigDecimal lucroTotal = faturamentoTotal.subtract(custoTotal);

        // 4. Retorna o DTO
        return new DashboardResponseDTO(
                faturamentoTotal,
                custoTotal,
                lucroTotal,
                (long) concluidos.size() // Total de agendamentos concluídos
        );
    }
}