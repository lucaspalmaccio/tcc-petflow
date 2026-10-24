package br.com.petflow.notificacao;

/**
 * GoF Adapter (interface alvo): contrato que o Petflow espera para notificar clientes.
 */
public interface Notificador {

    void enviar(String destinatario, String mensagem);
}
