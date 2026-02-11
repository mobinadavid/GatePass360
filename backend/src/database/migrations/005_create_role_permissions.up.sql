CREATE TABLE role_permissions (
                                  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
                                  permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
                                  PRIMARY KEY (role_id, permission_id),
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);