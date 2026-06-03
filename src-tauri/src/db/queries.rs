use rusqlite::{params, Connection};
use uuid::Uuid;
#[derive(serde::Serialize, Clone)]
pub struct Project {
    id: String,
    name: String,
    color: String,
    favorite: bool,
    datecreated: String,
    deadline: String,
    minutesworked: u32,
    priority: String,
}

#[derive(serde::Serialize, Clone)]
pub struct Task {
    id: String,
    parentprojectid: String,
    name: String,
    favorite: bool,
    datecreated: String,
    estimateddays: u16,
    laststarted: Option<String>,
    active: bool,
    minutesworked: u32,
    priority: String,
}

pub fn get_projects(db_path: String) -> Result<Vec<Project>, String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            name,
            color,
            favorite,
            CAST(datecreated AS VARCHAR),
            CAST(deadline AS VARCHAR),
            minutesworked,
            priority
        FROM projects_with_time;")
        .map_err(|e| e.to_string())?;

    let projects = stmt
        .query_map([], |row| {
            Ok(Project {
                id:           row.get(0)?,
                name:         row.get(1)?,
                color:        row.get(2)?,
                favorite:     row.get(3)?,
                datecreated:  row.get(4)?,
                deadline:     row.get(5)?,
                minutesworked:row.get(6)?,
                priority:     row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(projects)
}

pub fn get_node_children(db_path: String, parent_id: String) -> Result<Vec<Task>, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            parentprojectid,
            name,
            favorite,
            datecreated,
            estimateddays,
            laststarted,
            active,
            minutesworked,
            priority
        FROM tasks
        WHERE parentid = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&parent_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                name: row.get(2)?,
                favorite: row.get::<_, u8>(3)? != 0,
                datecreated: row.get(4)?,
                estimateddays: row.get(5)?,
                laststarted: row.get(6)?,
                active: row.get(7)? ,
                minutesworked: row.get(8)?,
                priority: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn create_project(db_path: String, name: String, color: String, deadline: String, priority: String ) -> Result<(), String>{

    let new_uuid = Uuid::new_v4().to_string();

    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("INSERT INTO projects (id, name, color, deadline, priority) VALUES ($1, $2, $3, $4, $5);")
        .map_err(|e| e.to_string())?;
    stmt.execute([&new_uuid, &name, &color, &deadline, &priority])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_project(db_path: String, project_id: String) -> Result<(), String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("DELETE FROM projects WHERE id = $1;")
        .map_err(|e| e.to_string())?;

    stmt.execute([&project_id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_task(db_path: String, task_id: String) -> Result<(), String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("DELETE FROM tasks WHERE id = $1;")
        .map_err(|e| e.to_string())?;

    stmt.execute([&task_id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn create_task(db_path: String, parent_id: String, parent_project_id: String, parent_task_id: Option<String> , name: String, estimated_days: u16, priority: String ) -> Result<(), String>{

    let new_uuid = Uuid::new_v4().to_string();

    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("INSERT INTO tasks ( id, parentprojectid, parenttaskid, parentid, name, estimateddays, priority) VALUES ($1, $2, $3, $4, $5, $6, $7);")
        .map_err(|e| e.to_string())?;
    stmt.execute(params![ &new_uuid, &parent_project_id, &parent_task_id, &parent_id, &name, &estimated_days.to_string(), &priority])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn set_favorite(db_path: String, project_id: String, favorite_state: bool) -> Result<(), String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    println!("set favorite_state = {}", favorite_state);

    let mut favorite: u8 = 0;

    if favorite_state == true { favorite = 1; }

    let mut stmt = conn
        .prepare("UPDATE projects SET favorite = ? WHERE id = ?;")
        .map_err(|e| e.to_string())?;

    stmt.execute(params![favorite, project_id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_task(db_path: String, task_id: String) -> Result<Task, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            parentprojectid,
            name,
            favorite,
            datecreated,
            estimateddays,
            laststarted,
            active,
            minutesworked,
            priority
        FROM tasks
        WHERE id = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&task_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                name: row.get(2)?,
                favorite: row.get::<_, u8>(3)? != 0,
                datecreated: row.get(4)?,
                estimateddays: row.get(5)?,
                laststarted: row.get(6)?,
                active: row.get(7)? ,
                minutesworked: row.get(8)?,
                priority: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let return_val = tasks.get(0).unwrap().clone();

    Ok(return_val)
}

pub fn get_project(db_path: String, project_id: String) -> Result<Project, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            name,
            color,
            favorite,
            CAST(datecreated AS VARCHAR),
            CAST(deadline AS VARCHAR),
            minutesworked,
            priority
        FROM projects_with_time
        WHERE id = $1;")
        .map_err(|e| e.to_string())?;

    let projects = stmt
        .query_map([&project_id], |row| {
            Ok(Project {
                id:           row.get(0)?,
                name:         row.get(1)?,
                color:        row.get(2)?,
                favorite:     row.get(3)?,
                datecreated:  row.get(4)?,
                deadline:     row.get(5)?,
                minutesworked:row.get(6)?,
                priority:     row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let return_val = projects.get(0).unwrap().clone();

    Ok(return_val)
}

