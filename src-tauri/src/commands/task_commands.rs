use crate::db;
use crate::db::queries::task;
use crate::models::common::Status;
use crate::models::task::{Task, TaskCard};

#[tauri::command]
pub fn create_task(app: tauri::AppHandle, parent_id: String, parent_project_id: String, parent_task_id: Option<String>, task_name: String, estimated_days: u16, priority: String ) -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::create_task(db_path.display().to_string(), parent_id, parent_project_id, parent_task_id, task_name, estimated_days, priority)
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
pub fn update_task_status(app: tauri::AppHandle, task_id: String, status: Status) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    task::update_task_status(db_path.display().to_string(), task_id, status)
}