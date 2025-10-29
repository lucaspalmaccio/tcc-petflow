package br.com.petflow.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}

// ADICIONE também ao seu GlobalExceptionHandler:
/*
@ExceptionHandler(UnauthorizedException.class)
public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
}
*/