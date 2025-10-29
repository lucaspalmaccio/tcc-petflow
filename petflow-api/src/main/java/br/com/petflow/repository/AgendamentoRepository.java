package br.com.petflow.repository;

import br.com.petflow.model.Agendamento;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Pet;
import br.com.petflow.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    /**
     * Busca agendamentos dentro de um intervalo de datas com fetch dos relacionamentos
     * para evitar LazyInitializationException.
     */
    @Query("SELECT a FROM Agendamento a " +
            "JOIN FETCH a.cliente c " +
            "JOIN FETCH c.usuario " +
            "JOIN FETCH a.pet " +
            "LEFT JOIN FETCH a.servicos " +
            "WHERE a.dataHora BETWEEN :inicio AND :fim")
    List<Agendamento> findAllByDataHoraBetween(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    /**
     * Busca todos os agendamentos de um cliente específico (email do usuário) com fetch.
     */
    @Query("SELECT a FROM Agendamento a " +
            "JOIN FETCH a.cliente c " +
            "JOIN FETCH c.usuario u " +
            "JOIN FETCH a.pet " +
            "LEFT JOIN FETCH a.servicos " +
            "WHERE u.email = :email " +
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
}
