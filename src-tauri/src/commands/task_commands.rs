use crate::db;
use crate::db::queries::task;
use crate::models::common::Status;
use crate::models::task::{Task, TaskCard, TaskTimeInfo};

#[tauri::command]
pub fn create_task(app: tauri::AppHandle, parent_id: String, parent_project_id: String, parent_task_id: Option<String>, task_name: String, estimated_hours: Option<u16>, priority: String ) -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::create_task(db_path.display().to_string(), parent_id, parent_project_id, parent_task_id, task_name, estimated_hours, priority)
}

#[tauri::command]
pub fn delete_task(app: tauri::AppHandle, task_id: String)  -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::delete_task(db_path.display().to_string(),task_id)?;

    Ok(())
}

#[tauri::command]
pub fn get_tasks(app: tauri::AppHandle, parent_id: String) -> rusqlite::Result<Vec<Task>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::get_tasks(db_path.display().to_string(), parent_id)
}

#[tauri::command]
pub fn get_tasks_v2(app: tauri::AppHandle, parent_id: String) -> rusqlite::Result<Vec<TaskCard>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::get_tasks_v2(db_path.display().to_string(), parent_id)
}

#[tauri::command]
pub fn get_task(app: tauri::AppHandle, task_id: String) -> rusqlite::Result<Task, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::get_task(db_path.display().to_string(), task_id)
}

#[tauri::command]
pub fn update_task(app: tauri::AppHandle, task_id: String, new_name: Option<String>, new_estimate: Option<u16>, new_priority: Option<String>) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::update_task(db_path.display().to_string(), task_id, new_name, new_estimate, new_priority)
}

#[tauri::command]
pub fn update_task_status(app: tauri::AppHandle, task_id: String, status: Status) -> rusqlite::Result<bool, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::update_task_status(db_path.display().to_string(), task_id, status)
}

#[tauri::command]
pub fn update_task_active(app: tauri::AppHandle, task_id: String, active: bool, last_started: i64) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::update_task_active(db_path.display().to_string(), task_id, active, last_started)
}

#[tauri::command]
pub fn update_task_time_worked(app: tauri::AppHandle, task_id: String, new_time_worked : i64) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::update_task_time_worked(db_path.display().to_string(), task_id, new_time_worked)
}

#[tauri::command]
pub fn update_task_pause_time(app: tauri::AppHandle, task_id: String, accumulated : i64) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::update_task_pause_time(db_path.display().to_string(), task_id, accumulated)
}

#[tauri::command]
pub fn update_task_time_reset(app: tauri::AppHandle, task_id: String) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::update_task_time_reset(db_path.display().to_string(), task_id)
}


#[tauri::command]
pub fn get_task_time_info(app: tauri::AppHandle, task_id: String) -> rusqlite::Result<TaskTimeInfo, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::get_task_time_info(db_path.display().to_string(), task_id)
}

#[tauri::command]
pub fn get_total_time_worked(app: tauri::AppHandle, task_id: String) -> rusqlite::Result<i64, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::get_total_time_worked(db_path.display().to_string(), task_id)
}