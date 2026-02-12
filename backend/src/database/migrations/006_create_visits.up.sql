CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    visitor_id INT REFERENCES users(id),
    host_id INT REFERENCES users(id),
    purpose TEXT NOT NULL,
    visit_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'pending_host', -- pending_host, approved_by_host, rejected, approved_by_security
    rejection_reason TEXT,
    last_changed_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE visit_status_history (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30),
    changed_by INT REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 1. Create the function that performs the insert
CREATE OR REPLACE FUNCTION log_visit_status_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if the status has actually changed
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO visit_status_history (
            visit_id,
            old_status,
            new_status,
            changed_by,
            changed_at
        )
        VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NEW.last_changed_by,
            CURRENT_TIMESTAMP
        );
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach the trigger to the visits table
CREATE TRIGGER trigger_visit_status_history
    AFTER UPDATE ON visits
    FOR EACH ROW
    EXECUTE FUNCTION log_visit_status_changes();