use rusqlite::{Connection, Result};
use std::fs;
use crate::db::queries::{Project, Task};

mod db;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/


#[tauri::command]
fn db_init(app: tauri::AppHandle) -> Result<String, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("open failed for {}: {e}", db_path.display()))?;
    conn.execute_batch(db::dbinit::SCHEMA_SQL)
        .map_err(|e| e.to_string())?;

    Ok(db_path.to_string_lossy().into_owned())
}

#[tauri::command]
fn db_check_exists(app: tauri::AppHandle) -> Result< bool, String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    let db_state = db::dbinit::check_db_initialized(&db_path.display().to_string());

    Ok(db_state)
}
#[tauri::command]
fn db_teardown(app: tauri::AppHandle) -> Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    fs::remove_file(db_path).map_err(|e| e.to_string())?;

    Ok(())
}
#[tauri::command]
fn db_wipe(){

}

//----------------------------------------


#[tauri::command]
fn create_user(app: tauri::AppHandle, user_name: String) {

}
#[tauri::command]
fn create_project(app: tauri::AppHandle, project_name: String, color: String, deadline: String, priority: String)  -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::create_project(db_path.display().to_string(),project_name,color,deadline,priority)?;

    Ok(())
}

#[tauri::command]
fn delete_project(app: tauri::AppHandle, project_id: String)  -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::delete_project(db_path.display().to_string(),project_id)?;

    Ok(())
}

#[tauri::command]
fn delete_task(app: tauri::AppHandle, task_id: String)  -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::delete_task(db_path.display().to_string(),task_id)?;

    Ok(())
}

#[tauri::command]
fn create_task(app: tauri::AppHandle, parent_id: String, parent_project_id: String, parent_task_id: Option<String>, task_name: String, estimated_days: u16, priority: String ) -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::create_task(db_path.display().to_string(), parent_id, parent_project_id, parent_task_id, task_name, estimated_days, priority)
}

#[tauri::command]
fn get_projects(app: tauri::AppHandle, ) -> Result<Vec<db::queries::Project>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::get_projects(db_path.display().to_string())
}

#[tauri::command]
fn get_node_children(app: tauri::AppHandle, parent_id: String) -> Result<Vec<db::queries::Task>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::get_node_children(db_path.display().to_string(), parent_id)
}

#[tauri::command]
fn set_favorite(app: tauri::AppHandle, project_id: String, favorite_state: bool) -> Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::set_favorite(db_path.display().to_string(), project_id, favorite_state)
}

#[tauri::command]
fn get_task(app: tauri::AppHandle, task_id: String) -> Result<Task, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::get_task(db_path.display().to_string(), task_id)
}

#[tauri::command]
fn get_project(app: tauri::AppHandle, project_id: String) -> Result<Project, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::get_project(db_path.display().to_string(), project_id)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    std::env::set_var("RUST_BACKTRACE", "1");
    std::panic::set_hook(Box::new(|info| {
        // Writes to the terminal where `cargo tauri dev` is running
        eprintln!("\n=== PANIC ===\n{info}\n");
        eprintln!("{}", std::backtrace::Backtrace::force_capture());
    }));
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db_init,
            db_teardown,
            db_wipe,
            db_check_exists,
            get_projects,
            get_node_children,
            create_project,
            create_task,
            set_favorite,
            delete_project,
            get_task,
            get_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
