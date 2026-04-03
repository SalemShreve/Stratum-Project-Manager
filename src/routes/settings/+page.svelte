<script>
    import "./Settings.css";
    import ToggleButton from "../../common/components/ToggleButton/ToggleButton.svelte";
    import TextButton from "../../common/components/TextButton/TextButton.svelte";

    let toggled = $state(false);

</script>

<main class="settings-container">
    <div class="settings-section">
        <div class="settings-info">
            <h4 class="setting-title"> Data Storage Settings</h4>
            <div class="settings-option">
                <p class="setting-desc"> Use Organization DB</p>
                <ToggleButton isToggled={toggled} clickAction={() => toggled = !toggled} />
            </div>
            <div class="settings-option">
                <p class="setting-desc"> Setting description</p>
                <TextButton text="Create Local DB" kind="bright" size="small" />
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