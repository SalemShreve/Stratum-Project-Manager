use crate::db;
use crate::db::queries::project;
use crate::models::project::{Project, ProjectCard};

#[tauri::command]
pub fn create_project(app: tauri::AppHandle, project_name: String, color: String, deadline: String, priority: String)  -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    project::create_project(db_path.display().to_string(),project_name,color,deadline,priority)?;

    Ok(())
}

#[tauri::command]
pub fn delete_project(app: tauri::AppHandle, project_id: String)  -> Result< (), String > {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    project::delete_project(db_path.display().to_string(),project_id)?;

    Ok(())
}

#[tauri::command]
pub fn get_projects(app: tauri::AppHandle, ) -> rusqlite::Result<Vec<Project>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    project::get_projects(db_path.display().to_string())
}

#[tauri::command]
pub fn get_projects_v2(app: tauri::AppHandle, ) -> rusqlite::Result<Vec<ProjectCard>, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    project::get_projects_v2(db_path.display().to_string())
}

#[tauri::command]
pub fn get_project(app: tauri::AppHandle, project_id: String) -> rusqlite::Result<Project, String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    project::get_project(db_path.display().to_string(), project_id)
}

#[tauri::command]
pub fn set_favorite(app: tauri::AppHandle, project_id: String, favorite_state: bool) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    project::set_favorite(db_path.display().to_string(), project_id, favorite_state)
}

#[tauri::command]   
pub fn update_project(app: tauri::AppHandle, project_id: String, new_name: Option<String>, new_color: Option<String>, new_deadline: Option<String>, new_priority: Option<String>) -> rusqlite::Result<(), String> {
    let db_path = db::dbinit::resolve_db_path(&app)?;
    project::update_project(db_path.display().to_string(), project_id, new_name, new_color, new_deadline, new_priority)
}