package br.com.petflow.dto;

import br.com.petflow.model.PerfilUsuario;

public record NovoUsuarioDTO(
        String nome,
        String email,
        String senha,
        String perfil // ADMIN ou CLIENTE
) {}
