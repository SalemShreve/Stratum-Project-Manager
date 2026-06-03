use std::fs;
use rusqlite::Connection;
use crate::db;

#[tauri::command]
pub fn db_init(app: tauri::AppHandle) -> rusqlite::Result<String, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("open failed for {}: {e}", db_path.display()))?;
    conn.execute_batch(db::dbinit::SCHEMA_SQL)
        .map_err(|e| e.to_string())?;

    Ok(db_path.to_string_lossy().into_owned())
}

#[tauri::command]
pub fn db_check_exists(app: tauri::AppHandle) -> rusqlite::Result<bool, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    let db_state = db::dbinit::check_db_initialized(&db_path.display().to_string());

    Ok(db_state)
}
#[tauri::command]
pub fn db_teardown(app: tauri::AppHandle) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    fs::remove_file(db_path).map_err(|e| e.to_string())?;

    Ok(())
}
#[tauri::command]
pub fn db_wipe(){

}