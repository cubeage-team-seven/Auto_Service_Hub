-- Apply once to existing databases before starting a build using the new entities.
-- Resolve duplicate non-null usernames/emails in users first; do not delete or
-- merge production records automatically.
ALTER TABLE users
    ADD CONSTRAINT uk_users_username UNIQUE (username),
    ADD CONSTRAINT uk_users_email UNIQUE (email);

CREATE TABLE access_requests (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    version BIGINT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NULL,
    requested_role VARCHAR(40) NOT NULL,
    message VARCHAR(1000) NULL,
    status VARCHAR(20) NOT NULL,
    reviewed_by BIGINT NULL,
    reviewed_at DATETIME NULL,
    review_note VARCHAR(1000) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_access_requests_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id)
);

CREATE INDEX idx_access_requests_status_created
    ON access_requests (status, created_at);
