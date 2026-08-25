use rusqlite::{params, Connection};
use uuid::Uuid;
use crate::models::common::Status;
use crate::models::task::{Task, TaskCard, TaskTimeInfo};

pub fn get_tasks(db_path: String, parent_id: String) -> Result<Vec<Task>, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            parentprojectid,
            parentid,
            name,
            datecreated,
            estimatedhours,
            laststarted,
            active,
            milisecworked,
            priority,
            status,
            totaltasks,
            completedtasks,
            color
        FROM tasks_info_view
        WHERE parentid = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&parent_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                parentid: row.get(2)?,
                name: row.get(3)?,
                datecreated: row.get(4)?,
                estimatedhours: row.get(5)?,
                laststarted: row.get(6)?,
                active: row.get(7)? ,
                milisecworked: row.get(8)?,
                priority: row.get(9)?,
                status: row.get(10)?,
                totaltasks: row.get(11)?,
                completedtasks: row.get(12)?,
                color: row.get(13)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn get_tasks_v2(db_path: String, parent_id: String) -> Result<Vec<TaskCard>, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            id,
            parentprojectid,
            parentid,
            name,
            active,
            priority,
            status,
            totaltasks,
            completedtasks,
            color,
            datecreated
        FROM tasks_card_view
        WHERE parentid = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&parent_id], |row| {
            Ok(TaskCard {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                parentid: row.get(2)?,
                name: row.get(3)?,
                active: row.get(4)? ,
                priority: row.get(5)?,
                status: row.get(6)?,
                totaltasks: row.get(7)?,
                completedtasks: row.get(8)?,
                color: row.get(9)?,
                datecreated: row.get(10)?,
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
        .prepare("INSERT INTO tasks ( id, parentprojectid, parenttaskid, parentid, name, estimatedhours, priority) VALUES ($1, $2, $3, $4, $5, $6, $7);")
        .map_err(|e| e.to_string())?;
    stmt.execute(params![ &new_uuid, &parent_project_id, &parent_task_id, &parent_id, &name, &estimated_days.to_string(), &priority])
        .map_err(|e| e.to_string())?;

    run_task_status_sync(db_path, new_uuid).expect("Finished");

    Ok(())
}

pub fn update_task(db_path: String, task_id: String, new_name: Option<String>, new_estimate: Option<u16>, new_priority: Option<String>) -> Result<(), String> {
    let fields: Vec<(&str, String)> = vec![
        ("name = ?", new_name),
        ("estimatedhours = ?", new_estimate.map(|v| v.to_string())),
        ("priority = ?", new_priority),
    ]
        .into_iter()
        .filter_map(|(col, val)| val.map(|v| (col, v)))
        .collect();

    if fields.is_empty() {
        return Err("All update values empty.".into());
    }

    let query = format!(
        "UPDATE tasks SET {} WHERE id = ?",
        fields.iter().map(|(col, _)| *col).collect::<Vec<_>>().join(", ")
    );

    let mut params: Vec<&dyn rusqlite::ToSql> = fields.iter().map(|(_, v)| v as &dyn rusqlite::ToSql).collect();
    let id_ref: &dyn rusqlite::ToSql = &task_id;
    params.push(id_ref);

    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;
    conn.pragma_update(None, "recursive_triggers", true).map_err(|e| e.to_string())?;

    conn.execute(
        &query,params.as_slice(),
    )
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
            parentid,
            name,
            datecreated,
            estimatedhours,
            laststarted,
            active,
            milisecworked,
            priority,
            status,
            totaltasks,
            completedtasks,
            color
        FROM tasks_info_view
        WHERE id = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&task_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                parentprojectid: row.get(1)?,
                parentid: row.get(2)?,
                name: row.get(3)?,
                datecreated: row.get(4)?,
                estimatedhours: row.get(5)?,
                laststarted: row.get(6)?,
                active: row.get(7)? ,
                milisecworked: row.get(8)?,
                priority: row.get(9)?,
                status: row.get(10)?,
                totaltasks: row.get(11)?,
                completedtasks: row.get(12)?,
                color: row.get(13)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let return_val = tasks.get(0).unwrap().clone();

    Ok(return_val)
}


pub fn update_task_status(db_path: String, task_id: String, status: Status) -> Result<bool, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE tasks SET status = ?1 WHERE id = ?2",
        params![status, task_id],
    )
        .map_err(|e| e.to_string())?;

    run_task_status_sync(db_path, task_id).expect("Finished");

    Ok(true)
}

pub fn update_task_active(db_path: String, task_id: String, active: bool, last_started: i64) -> Result<(), String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE tasks SET active = ?1, laststarted = ?2 WHERE id = ?3",
        params![active, last_started, task_id],
    )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn update_task_pause_time(db_path: String, task_id: String, accumulated: i64) -> Result<(), String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE tasks SET active = 0, laststarted = null, accumulated = ?1  WHERE id = ?2",
        params![accumulated, task_id],
    )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn update_task_time_worked(db_path: String, task_id: String, new_time_worked: i64) -> Result<(), String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE tasks SET active = 0, laststarted = null, milisecworked = ?1  WHERE id = ?2",
        params![new_time_worked, task_id],
    )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn update_task_time_reset(db_path: String, task_id: String) -> Result<(), String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE tasks SET active = 0, laststarted = null, accumulated = null  WHERE id = ?1",
        params![task_id],
    )
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_task_time_info(db_path: String, task_id: String) -> Result<TaskTimeInfo, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT
            laststarted,
            active,
            milisecworked,
            accumulated
        FROM tasks_time_info
        WHERE id = $1;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&task_id], |row| {
            Ok(TaskTimeInfo {
                laststarted: row.get(0)?,
                active: row.get(1)? ,
                milisecworked: row.get(2)?,
                accumulated: row.get(3)?,

            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let return_val = tasks.get(0).unwrap().clone();

    Ok(return_val)
}

pub fn get_total_time_worked(db_path: String, task_id: String) -> Result<i64, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("with recursive descendants as (
                    select id, milisecworked
                    from tasks_info_view
                    where parentid = $1
                    union all
                    select t.id, t.milisecworked
                    from tasks_info_view t
                             join descendants d on t.parentid = d.id
                )
                select cast(total(milisecworked) as integer) as total_all_descendants
                from descendants;")
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([&task_id], |row| {
            Ok(row.get::<_, i64>(0)?)
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let return_val = tasks.get(0).unwrap().clone();

    Ok(return_val)
}

fn run_task_status_sync(db_path: String, task_id: String) -> Result<String, String> {
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "WITH RECURSIVE
                    chain(id, parentid, depth) AS (
                        SELECT id, parentid, 0 FROM tasks WHERE id = ?1
                        UNION ALL
                        SELECT t.id, t.parentid, c.depth + 1
                        FROM tasks t JOIN chain c ON t.id = c.parentid
                    ),
                    blocked(id) AS (
                        SELECT t.parentid
                        FROM tasks t
                        WHERE t.parentid IS NOT NULL
                          AND t.status <> 'completed'
                          AND NOT EXISTS (SELECT 1 FROM tasks k WHERE k.parentid = t.id)
                        UNION
                        SELECT t.parentid
                        FROM tasks t JOIN blocked b ON t.id = b.id
                        WHERE t.parentid IS NOT NULL
                    )
                UPDATE tasks
                SET status = CASE WHEN tasks.id IN (SELECT id FROM blocked)
                                      THEN 'incompleted' ELSE 'completed' END
                WHERE id IN (SELECT id FROM chain WHERE depth > 0);")
        .map_err(|e| e.to_string())?;

    stmt.execute(params![ &task_id ])
        .map_err(|e| e.to_string())?;

    Ok("Finished".to_string())
}
