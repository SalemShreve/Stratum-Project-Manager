<script>
    import "./Settings.css";
    import ToggleButton from "../../common/components/ToggleButton/ToggleButton.svelte";
    import TextButton from "../../common/components/TextButton/TextButton.svelte";

    let toggled = $state(false);

    let extdbstate = $state(false);
    let localDbCreated = $state(false);

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
                        <TextButton text="Create Local DB" kind="bright" size="small" clickAction={() => localDbCreated = true} />
                    {:else}
                        <div class="settings-option-btns">
                            <TextButton text="Wipe Local DB" kind="bright" size="small" />
                            <TextButton text="Remove Local DB" kind="bright" size="small" clickAction={() => localDbCreated = false}/>
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