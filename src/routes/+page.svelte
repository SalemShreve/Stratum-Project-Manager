<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import ProjectCard from "../common/components/ProjectDisplay/ProjectCard/ProjectCard.svelte";
  import TextButton from "../common/components/TextButton/TextButton.svelte";
  import IconButton from "../common/components/IconButton/IconButton.svelte";

  let isNewProjectModalOpen = $state(false);
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

    .home-container-topbar{
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        padding-bottom: 10px;
        position: sticky;
        z-index: 2;
        top: 0;
        backdrop-filter: blur(2px);
        background: rgba(15, 17, 23, 0.82);
        border-bottom: 1px solid var(--border-subtle);
    }

    .home-container-content {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-top: 10px;
    }
</style>

<main class="home-container">
    <div class="home-container-topbar">
        <div class="home-container-topbar-right-actions">
            <IconButton icon="trash" kind="transparent" size="medium"></IconButton>
        </div>
        <div class="home-container-topbar-left-actions">
            <TextButton kind="bright" size="medium" text="+ New Project" />
        </div>
    </div>
    <div class="home-container-content">
        <ProjectCard id={1} isFavorite={true} projectName="First Project" color="orange"></ProjectCard>
        <ProjectCard id={2} isFavorite={true} projectName="Second Project" color="pink"></ProjectCard>
        <ProjectCard id={3} isFavorite={false} projectName="Third Project" color="indigo"></ProjectCard>
        <ProjectCard id={4} isFavorite={false} projectName="Portal Refresh" color="lime"></ProjectCard>
        <ProjectCard id={5} isFavorite={false} projectName="Speed Test System" color="blue"></ProjectCard>
        <ProjectCard id={6} isFavorite={false} projectName="aksdjkhasjkdhahsdhjhasdhasdasdghasdjasdasdjhasdasdgasdg" color="purple"></ProjectCard>
    </div>
</main>
