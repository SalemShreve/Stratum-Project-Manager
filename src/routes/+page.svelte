<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import ProjectCard from "../common/components/ProjectDisplay/ProjectCard/ProjectCard.svelte";
  import TextButton from "../common/components/TextButton/TextButton.svelte";
  import IconButton from "../common/components/IconButton/IconButton.svelte";
  import Chip from "../common/components/Chip/Chip.svelte";
  import "./Home.css"
  import {mapProjectToProps, type Project} from "../common/types/types";

  let isNewProjectModalOpen = $state(false);
  let sort = $state<'all' | 'starred' | 'created' | 'deadline'>('all');
  let filter = $state< 'active' | 'low' | 'medium' | 'high' >();

  let projects = $state<Project[]>([]);

  async function loadProjects() {
      projects = await invoke<Project[]>("get_projects");
  }

  $effect(() => {
      loadProjects();
  });
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
    <div class="home-topbar">
        <div class="home-actionsbar">
            <IconButton icon="trash" kind="transparent" size="medium" hasBorder={true}></IconButton>
            <TextButton kind="bright" size="medium" text="+ New Project"> </TextButton>
        </div>
        <div class="home-filterbar">
            <div class="filter-right">
                <Chip text="All" active={sort === 'all'} clickAction={() => sort = 'all'}> </Chip>
                <Chip text="★ Starred" starred active={sort === 'starred'} clickAction={() => sort = 'starred'}> </Chip>
                <Chip text="Date Created" active={sort === 'created'} clickAction={() => sort = 'created'}> </Chip>
                <Chip text="Deadline" active={sort === 'deadline'} clickAction={() => sort = 'deadline'}> </Chip>
                <div class="divider"></div>
                <Chip text="Active" active={filter === 'active'} clickAction={() => filter = 'active'}> </Chip>
                <Chip text="Low" priority="low" active={filter === 'low'} clickAction={() => filter = 'low'}> </Chip>
                <Chip text="Medium" priority="medium" active={filter === 'medium'} clickAction={() => filter = 'medium'}> </Chip>
                <Chip text="High" priority="high" active={filter === 'high'} clickAction={() => filter = 'high'}> </Chip>
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
