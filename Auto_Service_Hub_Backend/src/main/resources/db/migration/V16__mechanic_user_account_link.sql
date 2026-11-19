-- Link mechanic profiles to login accounts without guessing from names.
-- Existing mechanics remain unlinked until an owner or manager explicitly
-- associates a MECHANIC user through the mechanic account-link endpoint.
ALTER TABLE mechanics
    ADD COLUMN user_id BIGINT NULL,
    ADD CONSTRAINT uk_mechanics_user_id UNIQUE (user_id),
    ADD CONSTRAINT fk_mechanics_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL;
