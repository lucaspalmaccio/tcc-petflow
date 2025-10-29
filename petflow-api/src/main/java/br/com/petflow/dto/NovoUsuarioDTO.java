package br.com.petflow.dto;

import br.com.petflow.model.PerfilUsuario;

public record NovoUsuarioDTO(
        String nome,
        String email,
        String senha_normal,
        String perfil // ADMIN ou CLIENTE
) {}
