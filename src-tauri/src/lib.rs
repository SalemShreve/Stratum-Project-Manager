mod db;
mod commands;
mod models;

use commands::project_commands::{create_project, get_projects, delete_project, get_project, set_favorite, update_project};
use commands::task_commands::{create_task, get_task, get_node_children};
use commands::db_commands::{db_init, db_teardown, db_wipe, db_check_exists};
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
            get_node_children,
            create_project,
            create_task,
            set_favorite,
            delete_project,
            get_task,
            get_project,
            update_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
