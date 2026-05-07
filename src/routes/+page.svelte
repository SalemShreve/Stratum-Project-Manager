<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import ProjectCard from "../common/components/ProjectDisplay/ProjectCard/ProjectCard.svelte";
  import TextButton from "../common/components/TextButton/TextButton.svelte";
  import IconButton from "../common/components/IconButton/IconButton.svelte";
  import Chip from "../common/components/Chip/Chip.svelte";
  import "./Home.css"
  import {mapProjectToProps, type Project} from "../common/types/types";
  import NewProjectModal from "../common/components/Modal/NewProjectModal/NewProjectModal.svelte";
  import {appState} from "../state/appState.svelte";
  import NewTaskModal from "../common/components/Modal/NewTaskModal/NewTaskModal.svelte";
  import Pill from "../common/components/Pill/Pill.svelte";
  import {onMount} from "svelte";

  let isNewProjectModalOpen = $state(false);

  let sort = $state<'none' | 'starred' | 'created' | 'deadline' | 'name'>('none');
  let activeFilter = $state(false)
  let lowFilter = $state(false)
  let mediumFilter = $state(false)
  let highFilter = $state(false)

  let projects = $state<Project[]>([]);

  async function loadProjects() {
      projects = await invoke<Project[]>("get_projects");
  }

  $effect(() => {
      appState.triggerUpdateProjectsList
      loadProjects();
  });

  onMount(async () => {
      appState.allExpanded = false;
  })
</script>

<style>
    .home-container {
        height: 100%;
        max-height: 100%;
        padding-left: 10px;
        padding-bottom: 10px;
        padding-right: 2px;
        overflow-y: scroll;
    }
    * {
        scrollbar-width: thin;
        scrollbar-color: var(--border-subtle) transparent;
    }
</style>

<main class="home-container">
    <NewProjectModal bind:isNewProjectModalOpen ></NewProjectModal>
    <NewTaskModal></NewTaskModal>
    <div class="home-topbar">
        <div class="home-actionsbar">
            <div class="home-actionsbar-left">
                <h1 style="font-family: var(--font-mono); margin: 0; color: var(--text-primary)">Projects</h1>
                <Pill text="{projects.length} Projects"></Pill>
            </div>
            <TextButton kind="bright" size="medium" text="+ New Project" clickAction={() => isNewProjectModalOpen = true}> </TextButton>
        </div>
        <div class="home-filterbar">
            <div class="filter-right">
                <IconButton kind="transparent" size="small" icon="expandall" toggleIcon="collapseall" isToggled={appState.allExpanded} clickAction={() => appState.allExpanded = !appState.allExpanded}></IconButton>
                <div class="divider"></div>
                <span class="text-label">Sort</span>
                <Chip text="None" active={sort === 'none'} clickAction={() => sort = 'none'}> </Chip>
                <Chip text="★ Starred" starred active={sort === 'starred'} clickAction={() => sort = 'starred'}> </Chip>
                <Chip text="Name" active={sort === 'name'} clickAction={() => sort = 'name'}> </Chip>
                <Chip text="Date Created" active={sort === 'created'} clickAction={() => sort = 'created'}> </Chip>
                <Chip text="Deadline" active={sort === 'deadline'} clickAction={() => sort = 'deadline'}> </Chip>
                <div class="divider"></div>
                <span class="text-label">Filter</span>
                <Chip text="Active" active={activeFilter} clickAction={() => activeFilter = !activeFilter}> </Chip>
                <Chip text="Low" priority="low" active={lowFilter} clickAction={() => lowFilter = !lowFilter}> </Chip>
                <Chip text="Medium" priority="medium" active={mediumFilter} clickAction={() => mediumFilter = !mediumFilter}> </Chip>
                <Chip text="High" priority="high" active={highFilter} clickAction={() => highFilter = !highFilter}> </Chip>
            </div>
            <div class="filter-search">
                <input type="search">
            </div>
        </div>
    </div>
    <div class="home-container-content">
        {#each projects as project}
            {@const props = mapProjectToProps(project)}
            <ProjectCard {...props} />
        {/each}
    </div>
</main>
