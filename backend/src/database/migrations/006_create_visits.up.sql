CREATE TABLE visits (
                        id SERIAL PRIMARY KEY,
                        visitor_id INT REFERENCES users(id),
                        host_id INT REFERENCES users(id),
                        purpose TEXT NOT NULL,
                        visit_date DATE NOT NULL,
                        status VARCHAR(30) DEFAULT 'pending_host', -- pending_host, approved_by_host, rejected, approved_by_security
                        rejection_reason TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);