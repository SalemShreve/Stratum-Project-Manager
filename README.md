# Stratum Project Organizer

A desktop project management app for people who think in outlines. Projects hold tasks, tasks hold tasks, and that nesting goes as deep as the work actually goes — no artificial cap at subtasks or sub-subtasks. Built with Tauri, so it runs as a native desktop app with your data stored locally.

## Features

- **Projects** — create, edit, and organize the work you're tracking.
- **Tasks** — create and edit tasks within a project.
- **Unlimited task depth** — every task can have children, and those children can have children. Break work down as far as it's useful to break it down; the hierarchy doesn't stop you.
- **Time tracking** — start and stop a timer on any task to record how long the work actually takes.
- **Local-first storage** — everything lives in a SQLite database on your machine. No account, no server, no sync requirement.

## Installation

Download the latest Windows installer from the [Releases](https://github.com/SalemShreve/Stratum-Project-Manager/releases) page and run it. Stratum isn't code-signed yet, so Windows SmartScreen may warn you on first launch — choose **More info → Run anyway**.

## Tech stack

| Layer | Used |
| --- | --- |
| Shell | [Tauri v2](https://v2.tauri.app/) (Rust) |
| Frontend | [SvelteKit](https://kit.svelte.dev/) |
| Storage | SQLite (local) |

## Roadmap

Things on the list:
- Projects Page
  - Project due date / Task estimate and reminders
  - Search and improved filtering across deep hierarchies
- Gantt Page
  - Implement gantt chart
  - Ability to show child tasks individually
  - Project page integration
- General
  - macOS and Linux builds
  - Code signing and auto-updates

## License

TBD.