package br.com.petflow.service;

import br.com.petflow.evento.AgendamentoConcluidoEvent;
import br.com.petflow.evento.NotificacaoClienteListener;
import br.com.petflow.model.*;
import br.com.petflow.notificacao.Notificador;
import br.com.petflow.repository.*;
import br.com.petflow.service.cliente.ResolvedorClienteFactory;
import br.com.petflow.service.preco.PrecoSomaServicos;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgendamentoServiceEventoTest {

    @Mock private AgendamentoRepository agendamentoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private PetRepository petRepository;
    @Mock private ServicoRepository servicoRepository;
    @Mock private ProdutoService produtoService;
    @Mock private ResolvedorClienteFactory resolvedorClienteFactory;
    @Mock private ApplicationEventPublisher eventPublisher;

    private AgendamentoService service;
    private Agendamento agendamento;
    private final LocalDateTime dataHora = LocalDateTime.of(2030, 1, 10, 14, 0);

    @BeforeEach
    void preparar() {
        service = new AgendamentoService(agendamentoRepository, usuarioRepository, petRepository,
                servicoRepository, produtoService, new PrecoSomaServicos(), resolvedorClienteFactory, eventPublisher);

        Usuario usuario = new Usuario();
        usuario.setEmail("ana@petflow.com");
        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        Pet pet = new Pet();
        pet.setNome("Rex");

        agendamento = new Agendamento();
        agendamento.setId(5L);
        agendamento.setDataHora(dataHora);
        agendamento.setStatus(StatusAgendamento.AGENDADO);
        agendamento.setCliente(cliente);
        agendamento.setPet(pet);
    }

    @Test
    void concluirPublicaEventoComOsDadosDoAgendamento() {
        when(agendamentoRepository.findById(5L)).thenReturn(Optional.of(agendamento));
        when(agendamentoRepository.save(any(Agendamento.class))).thenAnswer(i -> i.getArgument(0));

        service.concluirAgendamento(5L);

        ArgumentCaptor<AgendamentoConcluidoEvent> captor = ArgumentCaptor.forClass(AgendamentoConcluidoEvent.class);
        verify(eventPublisher).publishEvent(captor.capture());
        assertEquals(new AgendamentoConcluidoEvent(5L, "ana@petflow.com", "Rex", dataHora), captor.getValue());
        assertEquals(StatusAgendamento.CONCLUIDO, agendamento.getStatus());
    }

    @Test
    void concluirAgendamentoJaConcluidoNaoPublicaEvento() {
        agendamento.setStatus(StatusAgendamento.CONCLUIDO);
        when(agendamentoRepository.findById(5L)).thenReturn(Optional.of(agendamento));

        assertThrows(IllegalStateException.class, () -> service.concluirAgendamento(5L));

        verifyNoInteractions(eventPublisher);
    }

    @Test
    void falhaNoNotificadorNaoPropagaDoOuvinte() {
        Notificador notificador = mock(Notificador.class);
        doThrow(new RuntimeException("falha simulada")).when(notificador).enviar(any(), any());
        NotificacaoClienteListener listener = new NotificacaoClienteListener(notificador);

        assertDoesNotThrow(() -> listener.aoConcluirAgendamento(
                new AgendamentoConcluidoEvent(5L, "ana@petflow.com", "Rex", dataHora)));
    }
}
