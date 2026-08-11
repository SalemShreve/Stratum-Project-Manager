mod db;
mod commands;
mod models;
mod types;

use commands::project_commands::{create_project, get_projects, delete_project, get_project, set_favorite, update_project};
use commands::task_commands::{create_task, get_task, get_tasks};
use commands::db_commands::{db_init, db_teardown, db_wipe, db_check_exists};
use crate::commands::project_commands::get_projects_v2;
use crate::commands::task_commands::{delete_task, get_tasks_v2, update_task_status, update_task_active, get_task_time_info, update_task_time_worked, update_task_pause_time, update_task_time_reset, update_task};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

//----------------------------------------

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
            get_tasks,
            create_project,
            create_task,
            set_favorite,
            delete_project,
            get_task,
            get_project,
            update_project,
            update_task_status,
            update_task_active,
            delete_task,
            get_tasks_v2,
            get_projects_v2,
            get_task_time_info,
            update_task_time_worked,
            update_task_pause_time,
            update_task_time_reset,
            update_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
