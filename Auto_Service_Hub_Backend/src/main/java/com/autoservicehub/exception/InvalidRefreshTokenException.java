package com.autoservicehub.exception;

/**
 * A refresh token was absent, malformed, expired, tampered with, or not actually a
 * refresh token.
 *
 * <p>Reported as 401 UNAUTHORIZED (SRS 9.1) rather than 409, because the caller
 * is unauthenticated rather than in conflict with a business rule.
 *
 * <p>This is separate from the login path's {@link org.springframework.security.core.AuthenticationException}
 * deliberately: login failures share one deliberately generic message so that a
 * wrong username cannot be told from a wrong password, and reusing that handler
 * here would report a bad refresh token as "Invalid username or password".
 */
public class InvalidRefreshTokenException extends RuntimeException {

    /** The single message used for every refresh failure, to avoid leaking which check failed. */
    public static final String GENERIC_MESSAGE = "Refresh token is invalid or has expired.";

    public InvalidRefreshTokenException() {
        super(GENERIC_MESSAGE);
    }
}