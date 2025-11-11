package br.com.petflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // TEMPORÁRIO: Chave hardcoded para teste
    private String SECRET_KEY = "minhachavesupersecretajwtparaopetflowsistema2024muitoseguraabcdef123456";

    @Value("${jwt.expiration:86400000}")
    private Long EXPIRATION_TIME;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        System.out.println("\n================ JWT CONFIG (HARDCODED) ================");
        System.out.println("⚠️  USANDO CHAVE HARDCODED PARA TESTE!");
        System.out.println("🔑 Chave: " + SECRET_KEY.substring(0, 10) + "... (" + SECRET_KEY.length() + " chars)");

        this.signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        System.out.println("✅ Chave JWT inicializada!");
        System.out.println("⏳ Expiração: " + EXPIRATION_TIME + " ms");
        System.out.println("======================================================\n");
    }

    private SecretKey getSigningKey() {
        return signingKey;
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userDetails.getUsername());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}