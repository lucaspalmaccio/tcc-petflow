package br.com.petflow.controller;

import br.com.petflow.dto.DashboardResponseDTO;
import br.com.petflow.service.FinanceiroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/financeiro")
@Tag(name = "Financeiro", description = "Endpoints para o dashboard financeiro (Admin)")
public class FinanceiroController {

    private final FinanceiroService financeiroService;

    public FinanceiroController(FinanceiroService financeiroService) {
        this.financeiroService = financeiroService;
    }

    /**
     * UC08 - Visualizar Dashboard Financeiro
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')") // Protege o endpoint (só Admin pode acessar)
    @SecurityRequirement(name = "bearer-key") // Para Swagger UI
    @Operation(
            summary = "Obtém os dados do Dashboard Financeiro",
            description = "Retorna o faturamento total, custo total e lucro total, " +
                    "calculados com base APENAS em agendamentos concluídos.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Dados do dashboard calculados com sucesso"),
                    @ApiResponse(responseCode = "403", description = "Acesso negado (Usuário não é ADMIN)")
            }
    )
    public ResponseEntity<DashboardResponseDTO> getDashboard() {
        DashboardResponseDTO dashboardData = financeiroService.getDashboard();
        return ResponseEntity.ok(dashboardData);
    }
}