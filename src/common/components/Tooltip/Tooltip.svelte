<script lang="ts">
    import "./Tooltip.css"

    let {
        text
    } = $props<{
        text: string;
    }>();
</script>

<span class="tooltip" >{text}</span>