package br.com.petflow.config;

import br.com.petflow.model.Usuario;
import br.com.petflow.repository.UsuarioRepository;
import br.com.petflow.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SimpleAuthFilter extends OncePerRequestFilter {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // DEBUG
        System.out.println("=== SimpleAuthFilter DEBUG ===");
        System.out.println("URI: " + request.getRequestURI());
        System.out.println("Authorization Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();
        String email;
        try {
            email = jwtUtil.extractUsername(token);
            System.out.println("Email extraído do token: " + email);
        } catch (ExpiredJwtException eje) {
            sendUnauthorized(response, "Token expirado");
            return;
        } catch (JwtException | IllegalArgumentException e) {
            sendUnauthorized(response, "Token inválido");
            return;
        } catch (Exception e) {
            sendUnauthorized(response, "Erro ao processar token");
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
            if (usuario == null) {
                sendUnauthorized(response, "Usuário não encontrado");
                return;
            }

            UserDetails userDetails = User.builder()
                    .username(usuario.getEmail())
                    .password("") // senha não é necessária aqui
                    .authorities(Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name())
                    ))
                    .build();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Autenticação configurada com sucesso para: " + usuario.getEmail());
        }

        System.out.println("=== FIM DEBUG ===\n");
        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String json = "{\"erro\":\"" + message + "\"}";
        response.getWriter().write(json);
    }
}
