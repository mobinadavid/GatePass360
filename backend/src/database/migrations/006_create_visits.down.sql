DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS visit_status_history CASCADE;
DROP TRIGGER IF EXISTS trigger_visit_status_history ON visits;
DROP FUNCTION IF EXISTS log_visit_status_changes();