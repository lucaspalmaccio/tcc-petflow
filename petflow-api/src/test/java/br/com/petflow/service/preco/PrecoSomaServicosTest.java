package br.com.petflow.service.preco;

import br.com.petflow.model.Servico;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PrecoSomaServicosTest {

    private final PrecoSomaServicos estrategia = new PrecoSomaServicos();

    private Servico servico(String preco) {
        Servico s = new Servico();
        s.setPreco(new BigDecimal(preco));
        return s;
    }

    @Test
    void somaOsPrecosDosServicos() {
        BigDecimal total = estrategia.calcular(List.of(servico("50.00"), servico("30.50")));
        assertEquals(new BigDecimal("80.50"), total);
    }

    @Test
    void listaVaziaResultaEmZero() {
        assertEquals(BigDecimal.ZERO, estrategia.calcular(List.of()));
    }
}
