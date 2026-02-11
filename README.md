# GatePass360 Backend Docs

Visitor entry and traffic management system designed for secure, role-based access control (RBAC).

## Minimum Required Infrastructure (LOM)

- 4 GB Memory
- 2 Core CPU
- 20 GB Storage
- Docker & Docker Compose installed

## Deployment Instructions

- **Clone the project from CVS:**
    ```shell
    git clone <repo_url> && cd GatePass360
    ```

- **Prepare Environment Variables:**
  Copy the example environment file to `.env` and modify the database credentials and JWT secret.
    ```shell
    cp .env.example .env
    ```

- **Download and Install Dependencies:**
  Navigate to the backend directory to install Node.js packages.
    ```shell
    cd backend && npm install
    ```

- **Start Infrastructure via Docker:**
  Launch the PostgreSQL database and administration tools.
    ```shell
    docker compose up -d
    ```

- **Handle Database Migrations:**
  Build the tables, relationships, and the automated history trigger.
    ```shell
    npm run migrate:up
    ```

- **Handle Database Seeders:**
  Populate the database with system roles (Guest, Host, Security, Admin) and permissions.
    ```shell
    npm run db:seed
    ```

---

## 📖 System Workflow



The system follows a strict state-machine logic to ensure security:

1.  **Guest Request:** Visitor creates a request entry in the `visits` table.
2.  **Host Review:** The assigned employee approves or rejects the visit via the dashboard.
3.  **Security Clearance:** Security verifies the approval and issues a unique, random `pass_code`.
4.  **Traffic Entry:** Security logs the `check_in_time` in the `passes` table.
5.  **Traffic Exit:** Security logs the `check_out_time` to finalize the visit cycle.

---

## 🛠 Database Management Commands

| Action | Command |
| :--- | :--- |
| **Migrate Up** | `npm run migrate:up` |
| **Migrate Down** | `npm run migrate:down` |
| **Seed Data** | `npm run db:seed` |

---

## 🛡 Security & Design Principles

* **RBAC Architecture**: Access is granted based on specific permissions linked to roles, managed server-side.
* **Password Hashing**: All user passwords are encrypted using **bcrypt** before storage.
* **JWT Authentication**: Secure stateless sessions with configurable expiration dates.
* **Audit Logging**: A database-level trigger captures every status change in the `visit_status_history` table (Bonus feature).



---
**Course:** Internet Engineering  
