DROP TABLE IF EXISTS visits;
DROP TRIGGER IF EXISTS trigger_visit_status_history ON visits;
DROP FUNCTION IF EXISTS log_visit_status_changes();