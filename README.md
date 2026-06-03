# Tauri + SvelteKit + TypeScript

This template should help get you started developing with Tauri, SvelteKit and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).


# Stratum

> Organize everything. At any depth.

Stratum is a hierarchical project organizer built for people who think in layers. Structure your work from the top down — folders hold projects, projects hold tasks, and tasks can nest as deeply as your workflow demands.

---

## Features

- **Folders** — Group related projects together in a clean, organized workspace.
- **Projects** — Each folder contains any number of projects, giving you clear scope and separation between different bodies of work.
- **Tasks** — Projects are built from tasks, the core unit of work in Stratum.
- **Infinite Task Depth** — Tasks can contain subtasks, which can contain their own subtasks, and so on — with no enforced limit on nesting depth. Model any workflow, no matter how complex.

---

## Structure

```
Stratum
└── 📁 Folder
    └── 📋 Project
        └── ✅ Task
            └── ✅ Subtask
                └── ✅ Subtask
                    └── ✅ ... (infinite depth)
```

---

## Getting Started

> _(Installation and setup instructions coming soon.)_

---

## Usage

1. **Create a Folder** to represent a broad area of work (e.g. *Personal*, *Work*, *Side Projects*).
2. **Add a Project** inside the folder to define a specific goal or deliverable.
3. **Add Tasks** to your project to break down the work.
4. **Nest subtasks** under any task to handle complexity — go as deep as you need.

---

## Roadmap

- [ ] Figure out quick access to projects without having to go through home page

### Home / Folder Page
- [ ] Redo current home page for folder card display

### Project Page
- [ ] Make working timer update minutesWorked of task on submission
- [ ] Make Separate project page a dynamic template (Taking folder name instead of Projects)
- [ ] Drag-and-drop reordering/reparenting
- [ ] Visual cue and/or reminder when project due date is close / estimated task time almost up
- [ ] Sorting and Filtering
- [ ] Shortcut to Gantt page with only selected project plotted

### Gantt page
- [ ] Implement Gantt chart to show all projects
- [ ] Ability to show child tasks of projects
- [ ] Integration with Project page showing only selected project

### Sprint Page
- [ ] Set custom sprint length
- [ ] Show work load for sprints according to 

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

[MIT](LICENSE)
