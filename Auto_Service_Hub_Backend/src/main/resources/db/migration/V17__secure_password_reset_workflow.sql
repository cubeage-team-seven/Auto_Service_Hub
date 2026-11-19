ALTER TABLE password_reset_otps
    ADD COLUMN attempt_count INT NOT NULL DEFAULT 0,
    ADD COLUMN reset_token_hash VARCHAR(100) NULL,
    ADD COLUMN reset_token_expires_at DATETIME NULL;

CREATE INDEX idx_password_reset_otps_user_created
    ON password_reset_otps (user_id, created_at);
