use rusqlite::{params, Connection};
use uuid::Uuid;
use crate::models::task::Task;

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
