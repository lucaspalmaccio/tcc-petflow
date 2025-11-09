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
     * CORREÇÃO: Query simplificada sem múltiplos fetch em coleções
     * O fetch será feito por EAGER nos relacionamentos necessários
     */
    @Query("SELECT DISTINCT a FROM Agendamento a " +
            "LEFT JOIN FETCH a.cliente " +
            "LEFT JOIN FETCH a.pet " +
            "WHERE a.dataHora BETWEEN :inicio AND :fim " +
            "ORDER BY a.dataHora")
    List<Agendamento> findAllByDataHoraBetween(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    /**
     * CORREÇÃO: Query simplificada para buscar agendamentos do cliente
     */
    @Query("SELECT DISTINCT a FROM Agendamento a " +
            "LEFT JOIN FETCH a.cliente c " +
            "LEFT JOIN FETCH a.pet " +
            "WHERE c.usuario.email = :email " +
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
     */
    List<Agendamento> findAllByStatus(StatusAgendamento status);
}