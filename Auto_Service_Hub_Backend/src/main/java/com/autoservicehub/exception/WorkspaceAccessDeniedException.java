package com.autoservicehub.exception;

public class WorkspaceAccessDeniedException extends RuntimeException {
    public WorkspaceAccessDeniedException() {
        super("Your account is not authorized for this workspace.");
    }
}
