package com.YessGelatinas.sistema_yess.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(int status, String mensaje, LocalDateTime timestamp, Map<String, String> errores) {
    public ErrorResponse(int status, String mensaje) {
        this(status, mensaje, LocalDateTime.now(), null);
    }
}
