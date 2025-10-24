package br.com.petflow.dto;

import br.com.petflow.model.Cliente;
import br.com.petflow.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO para receber dados de criação e atualização de Cliente (UC02).
 * Inclui os dados de login (Usuario) conforme fluxo UC02.
 */
public record ClienteDTO(
        Long id,

        // Dados do Usuário (para login)
        @NotBlank(message = "O nome do cliente é obrigatório")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String senha,

        // Dados do Cliente
        @NotBlank(message = "O CPF é obrigatório")
        @CPF(message = "CPF inválido")
        String cpf,

        @NotBlank(message = "O telefone é obrigatório")
        String telefone,

        String endereco,

        // Lista de pets (apenas para exibição)
        List<PetDTO> pets
) {
    /**
     * Construtor para converter uma Entidade Cliente em um ClienteDTO completo.
     */
    public ClienteDTO(Cliente cliente) {
        this(
                cliente.getId(),
                cliente.getUsuario().getNome(),
                cliente.getUsuario().getEmail(),
                null, // Nunca retornar a senha
                cliente.getCpf(),
                cliente.getTelefone(),
                cliente.getEndereco(),
                cliente.getPets().stream().map(PetDTO::new).collect(Collectors.toList())
        );
    }
}