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
    parentprojectid TEXT NOT NULL REFERENCES projects(id),
    parenttaskid    TEXT REFERENCES tasks(id),
    parentid        TEXT NOT NULL,
    name            TEXT NOT NULL,
    favorite        INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
    datecreated     TEXT NOT NULL DEFAULT (CURRENT_DATE),
    estimateddays   INTEGER NOT NULL DEFAULT 0,
    laststarted     TEXT,
    active          INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0, 1)),
    minutesworked   INTEGER NOT NULL DEFAULT 0,
    priority        TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high'))
    );

CREATE VIEW IF NOT EXISTS projects_with_time AS
SELECT
    p.id,
    p.name,
    p.color,
    p.favorite,
    p.datecreated,
    p.deadline,
    p.priority,
    COALESCE(SUM(t.minutesworked), 0) AS minutesworked
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