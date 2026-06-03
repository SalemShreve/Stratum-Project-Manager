use rusqlite::{params, Connection};
use uuid::Uuid;
use crate::models::project::Project;

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
