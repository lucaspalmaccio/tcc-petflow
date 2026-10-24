package br.com.petflow.service.cliente;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.PerfilUsuario;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResolvedorClienteTest {

    @Mock
    private ClienteRepository clienteRepository;

    private ResolvedorClienteFactory factory;
    private Usuario usuario;

    @BeforeEach
    void preparar() {
        factory = new ResolvedorClienteFactory(clienteRepository);
        usuario = new Usuario();
        usuario.setEmail("ana@petflow.com");
    }

    private AgendamentoRequestDTO dto(Long clienteId) {
        return new AgendamentoRequestDTO(clienteId, 1L, LocalDateTime.now().plusDays(1), List.of(1L));
    }

    @Test
    void fabricaRetornaResolvedorAdminParaAdmin() {
        assertInstanceOf(ResolvedorClienteAdmin.class, factory.para(PerfilUsuario.ADMIN));
    }

    @Test
    void fabricaRetornaResolvedorProprioParaCliente() {
        assertInstanceOf(ResolvedorClienteProprio.class, factory.para(PerfilUsuario.CLIENTE));
    }

    @Test
    void adminResolveClientePeloId() {
        Cliente cliente = new Cliente();
        when(clienteRepository.findById(7L)).thenReturn(Optional.of(cliente));

        assertSame(cliente, factory.para(PerfilUsuario.ADMIN).resolver(usuario, dto(7L)));
    }

    @Test
    void adminSemClienteIdLancaIllegalArgument() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> factory.para(PerfilUsuario.ADMIN).resolver(usuario, dto(null)));
        assertEquals("O clienteId é obrigatório para o Admin criar agendamentos.", ex.getMessage());
    }

    @Test
    void adminComClienteInexistenteLancaNotFound() {
        when(clienteRepository.findById(9L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> factory.para(PerfilUsuario.ADMIN).resolver(usuario, dto(9L)));
        assertEquals("Cliente não encontrado com ID: 9", ex.getMessage());
    }

    @Test
    void clienteResolveOProprioCadastro() {
        Cliente cliente = new Cliente();
        when(clienteRepository.findByUsuario(usuario)).thenReturn(Optional.of(cliente));

        assertSame(cliente, factory.para(PerfilUsuario.CLIENTE).resolver(usuario, dto(99L)));
    }

    @Test
    void clienteSemCadastroLancaNotFound() {
        when(clienteRepository.findByUsuario(usuario)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> factory.para(PerfilUsuario.CLIENTE).resolver(usuario, dto(null)));
        assertEquals("Cliente não encontrado para o usuário: ana@petflow.com", ex.getMessage());
    }
}
