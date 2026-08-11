use crate::models::common::{Priority, Status};

#[derive(serde::Serialize, Clone)]
pub struct Task {
    pub id: String,
    pub parentprojectid: String,
    pub parentid: String,
    pub name: String,
    pub datecreated: String,
    pub estimatedhours: u16,
    pub laststarted: Option<i64>,
    pub active: bool,
    pub milisecworked: i64,
    pub priority: Priority,
    pub status: Status,
    pub totaltasks: u32,
    pub completedtasks: u32,
    pub color: String,
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
    pub datecreated: String,
}

#[derive(serde::Serialize, Clone)]
pub struct TaskTimeInfo {
    pub laststarted: Option<i64>,
    pub active: bool,
    pub milisecworked: i64,
    pub accumulated: Option<i64>,

}