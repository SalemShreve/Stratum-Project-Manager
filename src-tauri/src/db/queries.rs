use duckdb::Connection;

#[derive(serde::Serialize)]
pub struct Project {
    id: String,
    name: String,
    color: String,
    favorite: i32,
    datecreated: String,
    deadline: String,
    minutesworked: i32,
    priority: String,
}

#[derive(serde::Serialize)]
pub struct Task {
    id: String,
    parentprojectid: String,
    parenttaskid: Option<String>,
    name: String,
    favorite: i32,
    datecreated: String,
    deadline: String,
    laststarted: Option<String>,
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
            priority,
        FROM projects;")
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

pub fn get_project_tasks(db_path: String, parent_project_id: String) -> Result<Vec<Task>, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            parentprojectid,
            parenttaskid,
            name,
            favorite,
            CAST(datecreated AS VARCHAR),
            CAST(deadline AS VARCHAR),
            CAST(laststarted AS VARCHAR),
            CAST(minutesworked AS VARCHAR),
            priority,
        FROM tasks
        WHERE parentprojectid = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&parent_project_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                parenttaskid: row.get(2)?,
                name: row.get(3)?,
                favorite: row.get(4)?,
                datecreated: row.get(5)?,
                deadline: row.get(6)?,
                laststarted: row.get(7)?,
                minutesworked: row.get(8)?,
                priority: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn get_child_tasks(db_path: String, parent_task_id: String) -> Result<Vec<Task>, String>{
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            parentprojectid,
            parenttaskid,
            name,
            favorite,
            CAST(datecreated AS VARCHAR),
            CAST(deadline AS VARCHAR),
            CAST(laststarted AS VARCHAR),
            CAST(minutesworked AS VARCHAR),
            priority,
        FROM tasks
        WHERE parenttaskid = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&parent_task_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                parenttaskid: row.get(2)?,
                name: row.get(3)?,
                favorite: row.get(4)?,
                datecreated: row.get(5)?,
                deadline: row.get(6)?,
                laststarted: row.get(7)?,
                minutesworked: row.get(8)?,
                priority: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)

}