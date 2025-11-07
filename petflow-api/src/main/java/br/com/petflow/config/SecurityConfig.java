package br.com.petflow.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// === INÍCIO CORREÇÃO CORS ===
// Importa o HttpMethod para usar no authorizeHttpRequests
import org.springframework.http.HttpMethod;
// === FIM CORREÇÃO CORS ===
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SimpleAuthFilter simpleAuthFilter;

    /**
     * Configuração de segurança principal.
     */
    @Bean
    public org.springframework.security.web.SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // desabilita CSRF
                // Aplica a configuração de CORS definida no bean 'corsFilter'
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // === INÍCIO CORREÇÃO CORS ===
                        // Permite preflight requests (OPTIONS) explicitamente
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // === FIM CORREÇÃO CORS ===
                        .anyRequest().permitAll() // permite todas as outras rotas (temporário)
                )
                .addFilterBefore(simpleAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * PasswordEncoder para senhas em hash (BCrypt).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configuração de CORS para permitir requisições do Angular.
     * * @Bean
     * public CorsFilter corsFilter() { ... }
     * (Este método @Bean é automaticamente pego pelo http.cors() se nomeado 'corsFilter')
     * (Vamos renomear para 'corsConfigurationSource' para sermos mais explícitos no Spring Security 3+)
     */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200")); // origem do Angular

        // === INÍCIO CORREÇÃO CORS ===
        // Adiciona "PATCH" à lista de métodos permitidos
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // === FIM CORREÇÃO CORS ===

        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}