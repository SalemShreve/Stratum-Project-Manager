<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import IconButton from "../common/components/IconButton/IconButton.svelte";

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
        /*height: 100%;*/
        /*width: 100%;*/
    }
</style>

<main class="home-container">
    <IconButton kind="bright" size="24" icon="settings" clickAction={() => console.log(window.location.pathname)} />
</main>


