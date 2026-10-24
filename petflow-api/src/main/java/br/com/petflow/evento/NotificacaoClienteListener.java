package br.com.petflow.evento;

import br.com.petflow.notificacao.Notificador;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * GoF Observer (observador): avisa o cliente que o atendimento foi concluído.
 * Depende apenas da interface Notificador (Baixo Acoplamento).
 */
@Component
public class NotificacaoClienteListener {

    private static final Logger log = LoggerFactory.getLogger(NotificacaoClienteListener.class);

    private final Notificador notificador;

    public NotificacaoClienteListener(Notificador notificador) {
        this.notificador = notificador;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void aoConcluirAgendamento(AgendamentoConcluidoEvent evento) {
        try {
            if (evento.emailCliente() == null) {
                return;
            }
            String mensagem = "O atendimento de " + evento.nomePet() + " (" + evento.dataHora()
                    + ") foi concluído. Obrigado por escolher o Petflow!";
            notificador.enviar(evento.emailCliente(), mensagem);
        } catch (Exception e) {
            // Falha de um observador não pode afetar a conclusão nem os demais observadores
            log.error("Falha ao notificar cliente do agendamento {}", evento.agendamentoId(), e);
        }
    }
}
