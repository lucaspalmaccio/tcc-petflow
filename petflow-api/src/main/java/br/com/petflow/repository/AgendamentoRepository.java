package br.com.petflow.repository;

import br.com.petflow.model.Agendamento;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Pet;
import br.com.petflow.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    /**
     * Busca agendamentos dentro de um intervalo de datas.
     * Essencial para a visão de calendário do Admin (UC05)[cite: 103].
     */
    List<Agendamento> findAllByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);

    /**
     * Busca agendamentos de um cliente específico (pelo e-mail do usuário).
     * Essencial para a visão do Cliente (UC05)[cite: 103].
     */
    List<Agendamento> findAllByClienteUsuarioEmailOrderByDataHoraDesc(String email);

    /**
     * Verifica se existe um agendamento em um horário específico.
     * Essencial para validar o bloqueio de horário (CT03.2)[cite: 109].
     * (Nota: Uma lógica mais complexa pode ser necessária para checar *sobreposição* de horários).
     */
    boolean existsByDataHora(LocalDateTime dataHora);

    /**
     * Verifica se um cliente possui agendamentos.
     * Usado no fluxo de exceção do UC02 (Exclusão de Cliente) [cite: 395-396].
     */
    boolean existsByCliente(Cliente cliente);

    /**
     * Verifica se um pet possui agendamentos.
     * Usado no fluxo de exceção do UC03.
     */
    boolean existsByPet(Pet pet);

    /**
     * Verifica se um serviço está vinculado a algum agendamento.
     * Usado no fluxo de exceção do UC04 (Exclusão de Item com Histórico)[cite: 413].
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
            "FROM Agendamento a JOIN a.servicos s WHERE s = :servico")
    boolean existsByServico(Servico servico);
}