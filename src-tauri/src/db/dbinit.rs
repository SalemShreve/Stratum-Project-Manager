use std::path::Path;
use duckdb::Connection;
use tauri::Manager;

pub const SCHEMA_SQL: &str = r#"
    CREATE TYPE IF NOT EXISTS priority_level AS ENUM ('low', 'medium', 'high');

    CREATE TABLE IF NOT EXISTS projects (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name          VARCHAR NOT NULL,
        color         VARCHAR NOT NULL,
        favorite      TINYINT DEFAULT 0,
        datecreated   DATE DEFAULT current_date,
        deadline      DATE NOT NULL,
        priority      priority_level NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        parentprojectid UUID REFERENCES projects(id) NOT NULL,
        parentid        UUID NOT NULL,
        name            VARCHAR NOT NULL,
        favorite        TINYINT DEFAULT 0,
        datecreated     DATE DEFAULT current_date,
        estimateddays   INTEGER DEFAULT 0,
        laststarted     TIMESTAMP,
        active          TINYINT DEFAULT 0,
        minutesworked   INTEGER DEFAULT 0,
        priority        priority_level NOT NULL
    );

    CREATE VIEW IF NOT EXISTS projects_with_time AS
    SELECT
        p.id,
        p.name,
        p.color,
        p.favorite,
        CAST(p.datecreated AS VARCHAR) AS datecreated,
        CAST(p.deadline AS VARCHAR)    AS deadline,
        p.priority,
        COALESCE(SUM(t.minutesworked), 0) AS minutesworked
    FROM projects p
    LEFT JOIN tasks t
        ON t.parentprojectid = p.id
        AND NOT EXISTS (
            SELECT 1 FROM tasks child WHERE child.parentid = t.id
        )
    GROUP BY
        p.id,
        p.name,
        p.color,
        p.favorite,
        p.datecreated,
        p.deadline,
        p.priority;
"#;

pub fn check_db_initialized(db_path: &str) -> bool {
    if !Path::new(db_path).exists() {
        return false;
    }
    let Ok(conn) = Connection::open(db_path) else {
        return false;
    };
    let tables = ["users", "projects", "tasks"];
    tables.iter().all(|t| {
        conn.query_row(
            "SELECT count(*) FROM information_schema.tables WHERE table_name = ?",
            [t],
            |row| row.get::<_, i64>(0),
        )
            .unwrap_or(0)
            > 0
    })
}

/// Resolves to: C:\Users\<user>\AppData\Local\StratumPO\stratumpo.duckdb
pub fn resolve_db_path(app: &tauri::AppHandle) -> Result<String, String> {
    let local_data_dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("Could not resolve AppData\\Local: {e}"))?;

    let stratum_dir = local_data_dir
        .parent()
        .unwrap_or(&local_data_dir)
        .join("StratumPO");

    std::fs::create_dir_all(&stratum_dir)
        .map_err(|e| format!("Could not create StratumPO directory: {e}"))?;

    Ok(stratum_dir
        .join("stratumpo.duckdb")
        .to_string_lossy()
        .into_owned())
}