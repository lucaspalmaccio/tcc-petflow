package br.com.petflow.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AgendamentoTest {

    private Agendamento comStatus(StatusAgendamento status) {
        Agendamento a = new Agendamento();
        a.setStatus(status);
        return a;
    }

    private Agendamento doEmail(String email) {
        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        Agendamento a = new Agendamento();
        a.setCliente(cliente);
        return a;
    }

    @Test
    void cancelarMudaStatusParaCancelado() {
        Agendamento a = comStatus(StatusAgendamento.AGENDADO);
        a.cancelar();
        assertEquals(StatusAgendamento.CANCELADO, a.getStatus());
    }

    @Test
    void cancelarConcluidoLancaExcecao() {
        Agendamento a = comStatus(StatusAgendamento.CONCLUIDO);
        IllegalStateException ex = assertThrows(IllegalStateException.class, a::cancelar);
        assertEquals("Não é possível cancelar um agendamento já concluído.", ex.getMessage());
        assertEquals(StatusAgendamento.CONCLUIDO, a.getStatus());
    }

    @Test
    void concluirMudaStatusParaConcluido() {
        Agendamento a = comStatus(StatusAgendamento.AGENDADO);
        a.concluir();
        assertEquals(StatusAgendamento.CONCLUIDO, a.getStatus());
    }

    @Test
    void concluirCanceladoOuJaConcluidoLancaExcecao() {
        for (StatusAgendamento status : new StatusAgendamento[]{StatusAgendamento.CANCELADO, StatusAgendamento.CONCLUIDO}) {
            Agendamento a = comStatus(status);
            IllegalStateException ex = assertThrows(IllegalStateException.class, a::concluir);
            assertEquals("Apenas agendamentos com status 'AGENDADO' podem ser concluídos.", ex.getMessage());
            assertEquals(status, a.getStatus());
        }
    }

    @Test
    void pertenceAoEmailIgnoraMaiusculas() {
        assertTrue(doEmail("Ana@Petflow.com").pertenceAoEmail("ana@petflow.com"));
    }

    @Test
    void naoPertenceAEmailDiferente() {
        assertFalse(doEmail("ana@petflow.com").pertenceAoEmail("outro@petflow.com"));
    }

    @Test
    void semClienteOuSemUsuarioNaoPertence() {
        assertFalse(new Agendamento().pertenceAoEmail("ana@petflow.com"));

        Agendamento a = new Agendamento();
        a.setCliente(new Cliente());
        assertFalse(a.pertenceAoEmail("ana@petflow.com"));
    }
}
