package br.com.petflow.evento;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * GoF Observer (observador): registra em log a conclusão do agendamento.
 */
@Component
public class AuditoriaAgendamentoListener {

    private static final Logger log = LoggerFactory.getLogger(AuditoriaAgendamentoListener.class);

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void aoConcluirAgendamento(AgendamentoConcluidoEvent evento) {
        try {
            log.info("[AUDITORIA] Agendamento {} concluído (cliente={}, pet={}, dataHora={})",
                    evento.agendamentoId(), evento.emailCliente(), evento.nomePet(), evento.dataHora());
        } catch (Exception e) {
            // Falha de um observador não pode afetar a conclusão nem os demais observadores
            log.error("Falha na auditoria do agendamento {}", evento.agendamentoId(), e);
        }
    }
}
