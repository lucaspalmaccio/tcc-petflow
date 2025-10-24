package br.com.petflow.controller;

import br.com.petflow.dto.ServicoDTO;
import br.com.petflow.service.ServicoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos") // Rota será protegida (ROLE_ADMIN)
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    /**
     * UC04 - Adicionar Serviço
     */
    @PostMapping
    public ResponseEntity<ServicoDTO> criarServico(@RequestBody @Valid ServicoDTO servicoDTO) {
        ServicoDTO novoServico = servicoService.criarServico(servicoDTO);
        return new ResponseEntity<>(novoServico, HttpStatus.CREATED);
    }

    /**
     * UC04 - Listar Serviços
     */
    @GetMapping
    public ResponseEntity<List<ServicoDTO>> listarServicos() {
        return ResponseEntity.ok(servicoService.listarTodos());
    }

    /**
     * UC04 - Buscar Serviço por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServicoDTO> buscarServicoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicoService.buscarPorId(id));
    }

    /**
     * UC04 - Editar Serviço
     */
    @PutMapping("/{id}")
    public ResponseEntity<ServicoDTO> atualizarServico(@PathVariable Long id, @RequestBody @Valid ServicoDTO servicoDTO) {
        return ResponseEntity.ok(servicoService.atualizarServico(id, servicoDTO));
    }

    /**
     * UC04 - Excluir Serviço
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarServico(@PathVariable Long id) {
        servicoService.deletarServico(id);
        return ResponseEntity.noContent().build();
    }
}