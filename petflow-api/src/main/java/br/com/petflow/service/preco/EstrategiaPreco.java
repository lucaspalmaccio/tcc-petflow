package br.com.petflow.service.preco;

import br.com.petflow.model.Servico;

import java.math.BigDecimal;
import java.util.Collection;

/**
 * GoF Strategy: define a família de algoritmos de cálculo do valor de um agendamento.
 * Para uma futura regra (ex.: desconto), basta criar outra implementação.
 */
public interface EstrategiaPreco {

    BigDecimal calcular(Collection<Servico> servicos);
}
