package com.autoservicehub.exception;

import com.autoservicehub.config.RequestCorrelationIdFilter;
import com.autoservicehub.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Central error handling (SRS 15). Never leaks stack traces, SQL errors or
 * provider details to the client; logs full details server-side with a
 * correlation id instead.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * A rejected refresh token: 401 rather than 409, because the caller is
     * unauthenticated (SRS 9.1) rather than in conflict with a business rule.
     *
     * <p>Deliberately separate from {@link #handleAuthentication}, whose single
     * generic message is what stops the login route revealing whether a username
     * exists; reusing it here would report a bad refresh token as a bad password.
     */
    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRefreshToken(InvalidRefreshTokenException ex) {
        return build(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessRule(BusinessRuleException ex) {
        return build(HttpStatus.CONFLICT, "BUSINESS_RULE_VIOLATION", ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "FORBIDDEN", "You do not have permission to perform this action.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return build(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    /**
     * Failed authentication — bad username or password.
     *
     * <p>Without this handler Spring Security's {@code BadCredentialsException}
     * falls through to the generic {@link Exception} handler below and is
     * reported as 500, which blames the server for what is a rejected credential.
     * It also hid the real problem behind "Something went wrong", so a client
     * could not tell a wrong password from a genuine outage.
     *
     * <p>The message is deliberately generic: naming whether the account exists
     * would let an attacker enumerate valid usernames.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(AuthenticationException ex) {
        return build(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED",
                "Invalid username or password.");
    }

    /**
     * A required query parameter that was not supplied, or one that could not be
     * converted to its declared type (e.g. {@code date=not-a-date}).
     *
     * <p>Both are the caller's malformed request, so both are 400. Without these,
     * Spring's own exceptions fall through to the generic handler below and are
     * reported as 500 — which blames the server for a client mistake and hides the
     * real cause behind a generic "something went wrong".
     */
    @ExceptionHandler({
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<ApiErrorResponse> handleBadRequest(Exception ex) {
        if (ex instanceof MissingServletRequestParameterException missing) {
            return build(HttpStatus.BAD_REQUEST, "BAD_REQUEST",
                    "Required parameter '" + missing.getParameterName() + "' is missing.");
        }
        if (ex instanceof MethodArgumentTypeMismatchException mismatch) {
            return build(HttpStatus.BAD_REQUEST, "BAD_REQUEST",
                    "Parameter '" + mismatch.getName() + "' has an invalid value.");
        }
        // A malformed JSON body: the message is deliberately generic, since the
        // parser's own text can echo the payload back to the client.
        return build(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Request body is malformed.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
        // SRS 15: the detail is logged server-side against the correlation id,
        // and only a generic message reaches the client, so stack traces, SQL and
        // provider details are never exposed.
        log.error("Unhandled exception [{}]", currentCorrelationId(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Something went wrong. Please try again.");
    }

    /**
     * The correlation id of the request being handled, falling back to a fresh one.
     *
     * <p>Read from the current request rather than generated per error, so the id
     * the client sees in the response body is the same one that tagged the log line
     * above — which is the whole point of SRS 15. The fallback covers an error
     * raised outside a servlet request (e.g. during startup or in a plain unit test).
     */
    private String currentCorrelationId() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            // ServletRequestAttributes#getAttribute takes a scope, so the request is
            // read directly for the plain attribute the filter set on it.
            Object id = attributes.getRequest().getAttribute(RequestCorrelationIdFilter.ATTRIBUTE);
            if (id instanceof String s && !s.isBlank()) {
                return s;
            }
        }
        return UUID.randomUUID().toString();
    }

    private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String code, String message) {
        ApiErrorResponse error = new ApiErrorResponse(code, message, currentCorrelationId(), LocalDateTime.now());
        return ResponseEntity.status(status).body(error);
    }
}
