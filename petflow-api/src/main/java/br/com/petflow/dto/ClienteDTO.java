package br.com.petflow.dto; // <-- CORREÇÃO 1: Adiciona o pacote

// --- CORREÇÃO 2: Adiciona os imports necessários ---
import br.com.petflow.model.Cliente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.br.CPF;

import java.util.List;
import java.util.stream.Collectors;
// --- Fim das Correções ---

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {

    private Long id;

    @NotBlank(message = "O nome do cliente é obrigatório")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    // Senha não é obrigatória ao atualizar perfil
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido")
    private String cpf;

    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    private String endereco;

    private Long usuarioId;

    private List<PetDTO> pets;

    /**
     * Construtor para converter Cliente em ClienteDTO
     */
    public ClienteDTO(Cliente cliente) {
        this.id = cliente.getId();
        this.nome = cliente.getUsuario().getNome();
        this.email = cliente.getUsuario().getEmail();
        this.cpf = cliente.getCpf();
        this.telefone = cliente.getTelefone();
        this.endereco = cliente.getEndereco();
        this.usuarioId = cliente.getUsuario().getId();
        this.pets = cliente.getPets() != null
                ? cliente.getPets().stream().map(PetDTO::new).collect(Collectors.toList())
                : null;
    }
}