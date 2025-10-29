package br.com.petflow.config;

import br.com.petflow.model.Usuario;
import br.com.petflow.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filtro simples de autenticação (SEM JWT real).
 * Extrai o email do header Authorization e popula o SecurityContext.
 */
@Component
public class SimpleAuthFilter extends OncePerRequestFilter {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // DEBUG: Mostra o que está chegando
        System.out.println("=== SimpleAuthFilter DEBUG ===");
        System.out.println("URI: " + request.getRequestURI());
        System.out.println("Authorization Header: " + authHeader);

        // Se não tem header de autorização, continua sem autenticação
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Sem header Authorization ou não começa com Bearer");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Remove "Bearer " do header e pega o email
            String email = authHeader.substring(7).trim();
            System.out.println("Email extraído do token: " + email);

            if (email != null && !email.isEmpty()) {
                // Busca o usuário no banco pelo email
                Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

                if (usuario != null) {
                    System.out.println("Usuário encontrado: " + usuario.getEmail() + " - Perfil: " + usuario.getPerfil());

                    // Cria UserDetails com o perfil do usuário
                    UserDetails userDetails = User.builder()
                            .username(usuario.getEmail())
                            .password("") // não importa aqui
                            .authorities(Collections.singletonList(
                                    new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name())
                            ))
                            .build();

                    // Popula o contexto de segurança do Spring
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Autenticação configurada com sucesso!");
                } else {
                    System.out.println("ERRO: Usuário não encontrado no banco com email: " + email);
                }
            } else {
                System.out.println("ERRO: Email vazio ou null");
            }
        } catch (Exception e) {
            System.err.println("ERRO ao processar autenticação: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("=== FIM DEBUG ===\n");
        filterChain.doFilter(request, response);
    }
}