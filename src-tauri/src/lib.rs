use std::fs;
use duckdb::Connection;
use tauri::webview::cookie::time::Date;

mod db;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn db_init(app: tauri::AppHandle) -> Result<String, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;
    conn.execute_batch(db::dbinit::SCHEMA_SQL)
        .map_err(|e| e.to_string())?;

    Ok(db_path)
}

#[tauri::command]
fn db_check_exists(app: tauri::AppHandle) -> Result< bool, String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    let db_state = db::dbinit::check_db_initialized(&db_path);

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
fn create_user(app: tauri::AppHandle, user_name: String) -> Result<String, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;

    let query = format!("INSERT INTO users (name) VALUES ('{user_name}');");

    let conn = Connection::open(&db_path)
        .map_err(|e| e.to_string())?;
    conn.execute_batch(&query)
        .map_err(|e| e.to_string())?;

    Ok(db_path)
}
#[tauri::command]
fn create_project(app: tauri::AppHandle, project_name: String, color: String, deadline: Date){

}

#[tauri::command]
fn create_task(app: tauri::AppHandle, parent_id: String, parent_project_id: String, task_name: String ){

}

#[tauri::command]
fn get_projects(app: tauri::AppHandle, ) -> Result<Vec<db::queries::Project>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::get_projects(db_path)
}

#[tauri::command]
fn get_project_tasks(app: tauri::AppHandle, parent_project_id: String) -> Result<Vec<db::queries::Task>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::get_project_tasks(db_path, parent_project_id)
}

#[tauri::command]
fn get_child_tasks(app: tauri::AppHandle, parent_task_id: String) -> Result<Vec<db::queries::Task>, String>{
    let db_path = db::dbinit::resolve_db_path(&app)?;
    db::queries::get_child_tasks(db_path, parent_task_id)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db_init,
            db_teardown,
            db_wipe,
            db_check_exists,
            get_projects,
            get_project_tasks,
            get_child_tasks
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
