package br.com.petflow.service;

import br.com.petflow.model.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class TokenService {

    private final Long jwtExpirationMs = 86400000L; // 1 dia
    private final Key signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateTokenFake(Usuario usuario) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("nome", usuario.getNome())
                .claim("perfil", usuario.getPerfil().name())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    public Long getJwtExpirationMs() {
        return jwtExpirationMs;
    }
}
