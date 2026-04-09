<script>
    import "./Settings.css";
    import ToggleButton from "../../common/components/ToggleButton/ToggleButton.svelte";
    import TextButton from "../../common/components/TextButton/TextButton.svelte";
    import {invoke} from "@tauri-apps/api/core";
    import {onMount} from "svelte";

    let toggled = $state(false);

    let extdbstate = $state(false);
    let localDbCreated = $state(false);

    async function handleLocalDbCreated() {
        try {
            const dbPath = await invoke("db_init");
            console.log("DB ready at:", dbPath);
            localDbCreated = true
        } catch (error) {
            console.error("Failed to init DB:", error);
        }
    }

    async function handleLocalDbRemoved() {
        try {
            await invoke("db_teardown");
            localDbCreated = false
        } catch (error) {
            console.error("Failed to delete DB");
        }
    }

    onMount(async () => {
        try {
            const dbExists = await invoke("db_check_exists");
            console.log("DB exists:", dbExists);
            localDbCreated = dbExists
        } catch (error) {
            console.error("Failed to get DB status");
        }
    })

</script>

<main class="settings-container">
    <div class="settings-section">
        <div class="settings-info">
            <h4 class="setting-title"> Data Storage Settings</h4>
            <div class="settings-option">
                <p class="setting-desc"> Use External database</p>
                <ToggleButton isToggled={extdbstate} clickAction={() => extdbstate = !extdbstate} />
            </div>
            <div class="settings-option">
                {#if !extdbstate}
                    <p class="setting-desc"> Set Up Local database</p>
                    {#if !localDbCreated}
                        <TextButton text="Create Local DB" kind="bright" size="small" clickAction={() => handleLocalDbCreated()} />
                    {:else}
                        <div class="settings-option-btns">
                            <TextButton text="Wipe Local DB" kind="bright" size="small" />
                            <TextButton text="Remove Local DB" kind="bright" size="small" clickAction={() => handleLocalDbRemoved()}/>
                        </div>
                    {/if}
                {:else}
                    <p class="setting-desc"> Set Up External database</p>
                    <div class="db-form-grid">
                        <input type="text" placeholder="Host" />
                        <input type="text" placeholder="Port" />
                        <input type="text" placeholder="User" />
                        <input type="text" placeholder="Password" />
                        <input type="text" placeholder="Database" />
                        <TextButton text="Submit and Test" kind="bright" size="small" />
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <div class="settings-section">
        <div class="settings-info">
            <h4 class="setting-title"> Setting</h4>
            <p class="setting-desc"> Setting description</p>
        </div>
        <ToggleButton isToggled={toggled} clickAction={() => toggled = !toggled} />
    </div>
</main>