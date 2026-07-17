use crate::models::common::Priority;

#[derive(serde::Serialize, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub color: String,
    pub favorite: bool,
    pub datecreated: String,
    pub deadline: String,
    pub minutesworked: u32,
    pub priority: Priority,
    pub totaltasks: u32,
    pub completedtasks: u32
}

#[derive(serde::Serialize, Clone)]
pub struct ProjectCard {
    pub id: String,
    pub name: String,
    pub color: String,
    pub favorite: bool,
    pub datecreated: String,
    pub deadline: String,
    pub priority: Priority,
    pub totaltasks: u32,
    pub completedtasks: u32
}