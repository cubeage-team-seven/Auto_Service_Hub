package com.autoservicehub.exception;

public class PasswordResetRejectedException extends RuntimeException {

    public PasswordResetRejectedException() {
        super("The reset code is invalid or expired.");
    }
}
