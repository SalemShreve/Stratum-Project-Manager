#[derive(serde::Serialize, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub color: String,
    pub favorite: bool,
    pub datecreated: String,
    pub deadline: String,
    pub minutesworked: u32,
    pub priority: String,
}