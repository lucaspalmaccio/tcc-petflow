package br.com.petflow.repository;

import br.com.petflow.model.Agendamento;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Pet;
import br.com.petflow.model.Servico;
import br.com.petflow.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    /**
     * Busca agendamentos dentro de um intervalo de datas com fetch dos relacionamentos
     * ATUALIZADO: Removemos o fetch de 'c.usuario' e 'a.servicos'.
     */
    @Query("SELECT a FROM Agendamento a " +
            "LEFT JOIN FETCH a.cliente c " +
            // "LEFT JOIN FETCH c.usuario " + // <-- CORREÇÃO: LINHA REMOVIDA
            "LEFT JOIN FETCH a.pet " +
            // "LEFT JOIN FETCH a.servicos " + // <-- CORREÇÃO: LINHA REMOVIDA
            "WHERE a.dataHora BETWEEN :inicio AND :fim")
    List<Agendamento> findAllByDataHoraBetween(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    /**
     * Busca todos os agendamentos de um cliente específico (email do usuário) com fetch.
     * ATUALIZADO: Removemos o fetch de 'c.usuario' e 'a.servicos', e ajustamos o WHERE.
     */
    @Query("SELECT a FROM Agendamento a " +
            "LEFT JOIN FETCH a.cliente c " +
            // "LEFT JOIN FETCH c.usuario u " + // <-- CORREÇÃO: LINHA REMOVIDA
            "LEFT JOIN FETCH a.pet " +
            // "LEFT JOIN FETCH a.servicos " + // <-- CORREÇÃO: LINHA REMOVIDA
            "WHERE c.usuario.email = :email " + // <-- ATUALIZADO: busca direta
            "ORDER BY a.dataHora DESC")
    List<Agendamento> findAllByClienteUsuarioEmailOrderByDataHoraDesc(@Param("email") String email);

    /**
     * Verifica se existe agendamento em um horário específico.
     */
    boolean existsByDataHora(LocalDateTime dataHora);

    /**
     * Verifica se um cliente possui agendamentos.
     */
    boolean existsByCliente(Cliente cliente);

    /**
     * Verifica se um pet possui agendamentos.
     */
    boolean existsByPet(Pet pet);

    /**
     * Verifica se um serviço está vinculado a algum agendamento.
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
            "FROM Agendamento a JOIN a.servicos s WHERE s = :servico")
    boolean existsByServico(Servico servico);

    /**
     * Busca todos os agendamentos por um status específico.
     * Necessário para o Dashboard Financeiro.
     */
    List<Agendamento> findAllByStatus(StatusAgendamento status);
}