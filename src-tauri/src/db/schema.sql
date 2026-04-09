-- SQLite schema converted from MySQL model
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(45)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nameproject VARCHAR(100),
    color VARCHAR(45),
    favorite TINYINT DEFAULT 0,
    datecreated DATE,
    deadline DATE,
    timeworked VARCHAR(45),
    createdby INTEGER,
    FOREIGN KEY (createdby) REFERENCES users(id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parentprojectid INTEGER,
    parentid INTEGER,
    nametask VARCHAR(45),
    favorite TINYINT DEFAULT 0,
    active TINYINT DEFAULT 0,
    laststarted,DATETIME,
    timeworked,VARCHAR(45),
    taskscolnVARCHAR(45),
    FOREIGN KEY (parentprojectid) REFERENCES projects(id)
);