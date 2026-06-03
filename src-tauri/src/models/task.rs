#[derive(serde::Serialize, Clone)]
pub struct Task {
    pub id: String,
    pub parentprojectid: String,
    pub name: String,
    pub favorite: bool,
    pub datecreated: String,
    pub estimateddays: u16,
    pub laststarted: Option<String>,
    pub active: bool,
    pub minutesworked: u32,
    pub priority: String,
}