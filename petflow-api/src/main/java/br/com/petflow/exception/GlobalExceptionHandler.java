package br.com.petflow.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Captura erros de Entidade Não Encontrada (ex: Cliente ID 99 não existe).
     * Retorna 404 NOT_FOUND.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleEntityNotFound(EntityNotFoundException ex) {
        return new ResponseEntity<>(Map.of("erro", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    /**
     * Captura erros de Validação de DTO (@Valid).
     * Retorna 400 BAD_REQUEST.
     * Fluxo UC01 [122] e UC02 [137].
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura erros de regra de negócio (ex: E-mail já existe).
     * Retorna 400 BAD_REQUEST.
     * Fluxo UC02 [137].
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return new ResponseEntity<>(Map.of("erro", ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura falhas de autenticação (ex: senha errada).
     * Retorna 401 UNAUTHORIZED.
     * Fluxo UC01 [123].
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity<>(Map.of("erro", "E-mail ou senha inválidos."), HttpStatus.UNAUTHORIZED);
    }

    /**
     * Captura genérica para outros erros inesperados.
     * Retorna 500 INTERNAL_SERVER_ERROR.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        // Logar a exceção (ex.printStackTrace())
        return new ResponseEntity<>(Map.of("erro", "Ocorreu um erro interno no servidor."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}