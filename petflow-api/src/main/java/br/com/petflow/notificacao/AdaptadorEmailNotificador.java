package br.com.petflow.notificacao;

import org.springframework.stereotype.Component;

/**
 * GoF Adapter: converte Notificador.enviar(destinatario, mensagem)
 * na chamada ProvedorEmailSimulado.disparar(para, assunto, corpo).
 */
@Component
public class AdaptadorEmailNotificador implements Notificador {

    static final String ASSUNTO_PADRAO = "Petflow - Notificação";

    private final ProvedorEmailSimulado provedor;

    public AdaptadorEmailNotificador() {
        this(new ProvedorEmailSimulado());
    }

    AdaptadorEmailNotificador(ProvedorEmailSimulado provedor) {
        this.provedor = provedor;
    }

    @Override
    public void enviar(String destinatario, String mensagem) {
        provedor.disparar(destinatario, ASSUNTO_PADRAO, mensagem);
    }
}
