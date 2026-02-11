CREATE TABLE passes (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    pass_code VARCHAR(100) UNIQUE NOT NULL,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            -- We assume the 'updated_at' was set by the user who made the change
            -- Note: In a real system, you might pass the user_id via a temp table or session var,
            -- but for this project, logging the IDs and statuses is the priority.
            NULL,
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