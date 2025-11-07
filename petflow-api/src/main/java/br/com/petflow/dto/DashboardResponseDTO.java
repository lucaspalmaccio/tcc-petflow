package br.com.petflow.dto;

import java.math.BigDecimal;

/**
 * DTO (Record) para transportar os dados do UC08 - Dashboard Financeiro [cite: 83]
 */
public record DashboardResponseDTO(
        BigDecimal faturamentoTotal,
        BigDecimal custoTotal,
        BigDecimal lucroTotal,
        Long totalAgendamentosConcluidos
) {}