package br.com.petflow.service.preco;

import br.com.petflow.model.Servico;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collection;

/**
 * GoF Strategy (estratégia concreta): valor total = soma simples dos preços dos serviços.
 */
@Component
public class PrecoSomaServicos implements EstrategiaPreco {

    @Override
    public BigDecimal calcular(Collection<Servico> servicos) {
        return servicos.stream()
                .map(Servico::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
