use crate::models::common::{Priority, Status};

#[derive(serde::Serialize, Clone)]
pub struct Task {
    pub id: String,
    pub parentprojectid: String,
    pub parentid: String,
    pub name: String,
    pub datecreated: String,
    pub estimateddays: u16,
    pub laststarted: Option<String>,
    pub active: bool,
    pub minutesworked: u32,
    pub priority: Priority,
    pub status: Status,
    pub totaltasks: u32,
    pub completedtasks: u32
}

#[derive(serde::Serialize, Clone)]
pub struct TaskCard {
    pub id: String,
    pub parentprojectid: String,
    pub parentid: String,
    pub name: String,
    pub active: bool,
    pub priority: Priority,
    pub status: Status,
    pub totaltasks: u32,
    pub completedtasks: u32,
    pub color: String,
}