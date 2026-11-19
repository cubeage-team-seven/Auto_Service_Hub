-- V15: Persist follow-up scheduling, reminders, and communication delivery state.
-- This project does not execute these versioned scripts automatically. Apply
-- manually in production; development uses Hibernate ddl-auto=update.

ALTER TABLE followups
    ADD COLUMN vehicle_id BIGINT NULL,
    ADD COLUMN assigned_user_id BIGINT NULL,
    ADD COLUMN followup_type VARCHAR(80) NULL,
    ADD COLUMN channel VARCHAR(32) NULL,
    ADD COLUMN reminder_at DATETIME(6) NULL,
    ADD CONSTRAINT fk_followup_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    ADD CONSTRAINT fk_followup_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users(id);

UPDATE followups
SET reminder_at = TIMESTAMP(due_date, '09:00:00')
WHERE reminder_at IS NULL AND due_date IS NOT NULL;
UPDATE followups
SET followup_type = 'Service Reminder'
WHERE followup_type IS NULL;
UPDATE followups
SET channel = 'PHONE_CALL'
WHERE channel IS NULL;
UPDATE followups f
JOIN job_cards j ON j.id = f.job_card_id
SET f.vehicle_id = j.vehicle_id
WHERE f.vehicle_id IS NULL AND j.vehicle_id IS NOT NULL;

CREATE INDEX idx_followup_vehicle_id ON followups(vehicle_id);
CREATE INDEX idx_followup_assigned_user_id ON followups(assigned_user_id);

CREATE TABLE followup_reminders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NULL,
    version BIGINT NULL,
    followup_id BIGINT NOT NULL,
    reminder_at DATETIME(6) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    status VARCHAR(20) NOT NULL,
    sent_at DATETIME(6) NULL,
    failure_reason VARCHAR(500) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_followup_reminder_followup
        FOREIGN KEY (followup_id) REFERENCES followups(id)
);

CREATE INDEX idx_followup_reminder_followup_id ON followup_reminders(followup_id);
CREATE INDEX idx_followup_reminder_status_due ON followup_reminders(status, reminder_at);

INSERT INTO followup_reminders (
    created_at, updated_at, version, followup_id, reminder_at, channel, status
)
SELECT f.created_at, f.updated_at, f.version, f.id, f.reminder_at, f.channel,
       CASE WHEN UPPER(f.status) IN ('COMPLETED', 'CANCELLED')
            THEN 'CANCELLED' ELSE 'PENDING' END
FROM followups f
WHERE f.reminder_at IS NOT NULL;

ALTER TABLE communications
    ADD COLUMN followup_id BIGINT NULL,
    ADD COLUMN delivery_status VARCHAR(20) NOT NULL DEFAULT 'RECORDED',
    ADD CONSTRAINT fk_communication_followup
        FOREIGN KEY (followup_id) REFERENCES followups(id);

CREATE INDEX idx_communication_followup_id ON communications(followup_id);

-- Existing outbound communication rows are historical records, not proof of
-- delivery; leave them RECORDED rather than misrepresenting them as sent.
UPDATE communications
SET delivery_status = CASE
    WHEN UPPER(direction) = 'INBOUND' THEN 'RECEIVED'
    ELSE 'RECORDED'
END;
