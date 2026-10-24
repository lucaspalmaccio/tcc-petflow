package br.com.petflow.notificacao;

import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class AdaptadorEmailNotificadorTest {

    @Test
    void convertePedidoDeNotificacaoEmChamadaAoProvedor() {
        ProvedorEmailSimulado provedor = mock(ProvedorEmailSimulado.class);
        Notificador notificador = new AdaptadorEmailNotificador(provedor);

        notificador.enviar("ana@petflow.com", "Seu pet está pronto");

        verify(provedor).disparar("ana@petflow.com", AdaptadorEmailNotificador.ASSUNTO_PADRAO, "Seu pet está pronto");
    }
}
