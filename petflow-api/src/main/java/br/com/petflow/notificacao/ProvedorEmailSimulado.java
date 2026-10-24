package br.com.petflow.notificacao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * SIMULAÇÃO de uma biblioteca de e-mail de terceiros (não deve ser alterada).
 * Nenhum e-mail real é enviado: a chamada apenas escreve em log.
 * GoF Adapter (adaptado): possui assinatura diferente da interface Notificador.
 */
public class ProvedorEmailSimulado {

    private static final Logger log = LoggerFactory.getLogger(ProvedorEmailSimulado.class);

    public void disparar(String para, String assunto, String corpo) {
        log.info("[EMAIL SIMULADO] para={} | assunto={} | corpo={}", para, assunto, corpo);
    }
}
