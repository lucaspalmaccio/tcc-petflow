package br.com.petflow.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // UC01: Permite acesso público ao endpoint de login
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                        // UC02 e UC03 (Sprint 01): Exigem ROLE_ADMIN
                        .requestMatchers("/api/clientes/**").hasRole("ADMIN")
                        .requestMatchers("/api/pets/**").hasRole("ADMIN")

                        // UC04 (Sprint 02): Exigem ROLE_ADMIN
                        .requestMatchers("/api/servicos/**").hasRole("ADMIN")
                        .requestMatchers("/api/produtos/**").hasRole("ADMIN")

                        // === INÍCIO DA ATUALIZAÇÃO SPRINT 03 ===
                        // UC05 (Sprint 03): Exigem ROLE_ADMIN ou ROLE_CLIENTE
                        .requestMatchers("/api/agendamentos/**").hasAnyRole("ADMIN", "CLIENTE")
                        // === FIM DA ATUALIZAÇÃO SPRINT 03 ===

                        // Exige autenticação para qualquer outra requisição
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}