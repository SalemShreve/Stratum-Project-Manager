use std::path::{Path, PathBuf};
use duckdb::Connection;
use tauri::Manager;

pub const SCHEMA_SQL: &str = r#"
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS projects (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        color         TEXT NOT NULL,
        favorite      INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
        datecreated   TEXT NOT NULL DEFAULT (CURRENT_DATE),
        deadline      TEXT NOT NULL,
        priority      TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high'))
        );

    CREATE TABLE IF NOT EXISTS tasks (
        id              TEXT PRIMARY KEY,
        parentprojectid TEXT NOT NULL,
        parenttaskid    TEXT,
        parentid        TEXT NOT NULL,
        name            TEXT NOT NULL,
        datecreated     TEXT NOT NULL DEFAULT (CURRENT_DATE),
        estimateddays   INTEGER NOT NULL DEFAULT 0,
        laststarted     TEXT,
        active          INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0, 1)),
        minutesworked   INTEGER NOT NULL DEFAULT 0,
        priority        TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
        status          TEXT NOT NULL DEFAULT 'incompleted' CHECK (status IN ('completed', 'incompleted', 'blocked')),
        FOREIGN KEY (parenttaskid) REFERENCES tasks (id) ON DELETE CASCADE,
        FOREIGN KEY (parentprojectid) REFERENCES projects (id) ON DELETE CASCADE
        );

    CREATE VIEW IF NOT EXISTS projects_view AS
    SELECT
        p.id,
        p.name,
        p.color,
        p.favorite,
        p.datecreated,
        p.deadline,
        p.priority,
        COALESCE(SUM(t.minutesworked), 0) AS minutesworked,
        (SELECT COUNT(*) FROM tasks t2
            WHERE t2.parentprojectid = p.id) AS totaltasks,
        (SELECT COUNT(*) FROM tasks t3
            WHERE t3.parentprojectid = p.id
            AND t3.status = 'completed') AS completedtasks
    FROM projects p
             LEFT JOIN tasks t
             ON t.parentprojectid = p.id
             AND NOT EXISTS ( SELECT 1 FROM tasks child WHERE child.parenttaskid = t.id )
    GROUP BY
        p.id,
        p.name,
        p.color,
        p.favorite,
        p.datecreated,
        p.deadline,
        p.priority;

    CREATE VIEW IF NOT EXISTS project_card_view AS
    SELECT
        p.id,
        p.name,
        p.color,
        p.favorite,
        p.deadline,
        p.priority,
        (SELECT COUNT(*) FROM tasks t2
            WHERE t2.parentprojectid = p.id) AS totaltasks,
        (SELECT COUNT(*) FROM tasks t3
            WHERE t3.parentprojectid = p.id
            AND t3.status = 'completed') AS completedtasks
    FROM projects p
    GROUP BY
        p.id,
        p.name,
        p.color,
        p.favorite,
        p.datecreated,
        p.deadline,
        p.priority;

    CREATE VIEW IF NOT EXISTS tasks_info_view AS
    SELECT
        p.id,
        p.parentprojectid,
        p.parentid,
        p.name,
        p.datecreated,
        p.estimateddays,
        p.priority,
        p.laststarted,
        p.active,
        p.status,
        COALESCE(SUM(t.minutesworked), 0) AS minutesworked,
        (SELECT COUNT(*) FROM tasks t2
            WHERE t2.parenttaskid = p.id) AS totaltasks,
        (SELECT COUNT(*) FROM tasks t3
            WHERE t3.parenttaskid = p.id
            AND t3.status = 'completed') AS completedtasks,
        (SELECT color FROM projects t4
            WHERE t4.id = p.parentprojectid) AS color
    FROM tasks p
             LEFT JOIN tasks t
             ON t.parenttaskid = p.id
             AND NOT EXISTS ( SELECT 1 FROM tasks child WHERE child.parenttaskid = t.id )
    GROUP BY
        p.id,
        p.name,
        p.datecreated,
        p.priority

    CREATE VIEW IF NOT EXISTS tasks_card_view AS
    SELECT
        p.id,
        p.parentprojectid,
        p.parentid,
        p.name,
        p.priority,
        p.active,
        p.status,
        (SELECT COUNT(*) FROM tasks t2
            WHERE t2.parenttaskid = p.id) AS totaltasks,
        (SELECT COUNT(*) FROM tasks t3
            WHERE t3.parenttaskid = p.id
            AND t3.status = 'completed') AS completedtasks,
        (SELECT color FROM projects t4
            WHERE t4.id = p.parentprojectid) AS color
    FROM tasks p
    GROUP BY
        p.id,
        p.name,
        p.datecreated,
        p.priority
"#;

pub fn check_db_initialized(db_path: &str) -> bool {
    if !Path::new(db_path).exists() {
        return false;
    }
    let Ok(conn) = Connection::open(db_path) else {
        return false;
    };
    let tables = ["projects", "tasks"];
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

/// Resolves to: C:\Users\<user>\AppData\Local\StratumPO\stratumprojectorganizer.db

pub fn resolve_db_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let local_data_dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("Could not resolve AppData\\Local: {e}"))?;

    let stratum_dir = local_data_dir
        .parent()
        .unwrap_or(&local_data_dir)
        .join("StratumProjectOrganizer");

    std::fs::create_dir_all(&stratum_dir)
        .map_err(|e| format!("Could not create StratumProjectOrganizer directory: {e}"))?;

    Ok(stratum_dir.join("stratumprojectorganizer.db"))
}