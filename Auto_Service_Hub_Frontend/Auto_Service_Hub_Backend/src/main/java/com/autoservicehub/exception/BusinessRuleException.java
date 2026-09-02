package com.autoservicehub.exception;

/**
 * Raised when a business rule from SRS section 12 is violated
 * (e.g. delivering a vehicle with incomplete QC, overpaying an invoice).
 */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
