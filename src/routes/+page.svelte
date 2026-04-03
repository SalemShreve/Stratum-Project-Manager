<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import ProjectCard from "../common/components/ProjectDisplay/ProjectCard/ProjectCard.svelte";

  let name = $state("");
  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name });
  }
</script>

<style>
    * {
        scrollbar-width: thin;
        scrollbar-color: var(--border-base) var(--bg-surface);
    }

    .home-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        overflow-y: scroll;
        height: 100%;
        max-height: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-right: 10px;
    }
</style>

<main class="home-container">
    <ProjectCard id={1} isFavorite={true} projectName="First Project" color="orange"></ProjectCard>
    <ProjectCard id={2} isFavorite={true} projectName="Second Project" color="pink"></ProjectCard>
    <ProjectCard id={3} isFavorite={false} projectName="Third Project" color="indigo"></ProjectCard>
    <ProjectCard id={4} isFavorite={false} projectName="Portal Refresh" color="lime"></ProjectCard>
    <ProjectCard id={5} isFavorite={false} projectName="Speed Test System" color="blue"></ProjectCard>
    <ProjectCard id={6} isFavorite={false} projectName="aksdjkhasjkdhahsdhjhasdhasdasdghasdjasdasdjhasdasdgasdg" color="purple"></ProjectCard>
</main>


