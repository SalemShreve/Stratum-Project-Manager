use duckdb::Connection;
#[derive(serde::Serialize)]
pub struct Project {
    id: String,
    name: String,
    color: String,
    favorite: u32,
    datecreated: String,
    deadline: String,
    minutesworked: u32,
    priority: String,
}

#[derive(serde::Serialize)]
pub struct Task {
    id: String,
    parentprojectid: String,
    parenttaskid: String,
    name: String,
    favorite: u8,
    datecreated: String,
    estimateddays: u16,
    laststarted: Option<String>,
    active: u8,
    minutesworked: String,
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

pub fn get_node_children(db_path: String, parent_id: String, node_type: u8) -> Result<Vec<Task>, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt;

    if node_type == 0 {
        stmt = conn
            .prepare("SELECT
            id,
            parentprojectid,
            parenttaskid,
            name,
            favorite,
            CAST(datecreated AS VARCHAR),
            estimateddays,
            CAST(laststarted AS VARCHAR),
            active,
            CAST(minutesworked AS VARCHAR),
            priority,
        FROM tasks
        WHERE parentprojectid = $1;")
            .map_err(|e| e.to_string())?;
    } else {
        stmt = conn
            .prepare("SELECT
            id,
            parentprojectid,
            parenttaskid,
            name,
            favorite,
            CAST(datecreated AS VARCHAR),
            estimateddays,
            CAST(laststarted AS VARCHAR),
            active,
            CAST(minutesworked AS VARCHAR),
            priority,
        FROM tasks
        WHERE parenttaskid = $1;")
            .map_err(|e| e.to_string())?;
    }

    let tasks = stmt
        .query_map([&parent_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                parenttaskid: row.get(2)?,
                name: row.get(3)?,
                favorite: row.get(4)?,
                datecreated: row.get(5)?,
                estimateddays: row.get(6)?,
                laststarted: row.get(7)?,
                active: row.get(8)? ,
                minutesworked: row.get(9)?,
                priority: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn create_project(db_path: String, name: String, color: String, deadline: String, priority: String ) -> Result<(), String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("INSERT INTO projects (name, color, deadline, priority) VALUES ($1, $2, $3, $4);")
        .map_err(|e| e.to_string())?;

    stmt.execute([&name, &color, &deadline, &priority])
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

pub fn create_task(db_path: String, parent_id: String, parent_project_id: String, name: String, estimated_days: u16, priority: String ) -> Result<(), String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("INSERT INTO tasks ( parentid, parentprojectid, name, estimateddays, priority) VALUES ($1, $2, $3, $4, $5);")
        .map_err(|e| e.to_string())?;

    stmt.execute([ &parent_id, &parent_project_id, &name, &estimated_days.to_string(), &priority])
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn set_favorite(db_path: String, project_id: String, favorite_state: bool) -> Result<(), String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("UPDATE projects set favorite = $2 WHERE id = $1;")
        .map_err(|e| e.to_string())?;

    stmt.execute([&project_id, &(favorite_state as u8).to_string()])
        .map_err(|e| e.to_string())?;

    Ok(())
}