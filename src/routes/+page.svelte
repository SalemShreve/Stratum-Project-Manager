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
    .home-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>

<main class="home-container">
    <ProjectCard projectName="First Project" color="orange"></ProjectCard>
    <ProjectCard projectName="Second Project" color="pink"></ProjectCard>
</main>


