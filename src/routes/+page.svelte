<script lang="ts">
    import { onMount } from "svelte";

    interface PP {
        path: string;
        folder: boolean;
        relative: string;
    }
    let data: { dir: PP[] } = { dir: [] };
    let path: string = "";

    async function get() {
        const response = await fetch("/", {
            method: "POST",
            body: JSON.stringify({ path: path }),
            headers: {
                "content-type": "application/json",
            },
        });

        data = await response.json();
    }
    onMount(() => {
        get();
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="main">
    <h2>Boon assets browser</h2>
    <h3
        on:click={(e) => {
            e.preventDefault();
            path = path.split("/").slice(0, -1).join("/");
            get();
        }}
    >
        ./{path}
    </h3>
    <div class="box">
        {#each data.dir as dir, _ (dir.path)}
            {@const isImage = dir.path.match(/\.(png|gif|jpeg|jpg)$/)}
            <div
                on:click={(e) => {
                    e.preventDefault();
                    if (dir.folder) {
                        path = dir.relative;
                        get();
                    }
                }}
            >
                <img
                    class="ico"
                    src={dir.folder
                        ? "/folder.svg"
                        : isImage
                        ? "/assets/" + dir.relative
                        : "/document.svg"}
                    alt=""
                />
                {#if isImage}
                    <div
                        class="copy"
                        on:click={(e) => {
                            e.preventDefault();
                            const l = e.currentTarget.querySelector("h1");
                            if (l){
                                l.textContent = "copied";
                                setTimeout(() => {
                                    l.textContent = "copy";
                                }, 300);
                            }
                            navigator.clipboard
                                .writeText(window.location.origin + "/assets/" + dir.relative)
                                .then(
                                    function () {
                                        console.log(
                                            "Async: Copying to clipboard was successful!"
                                        );
                                    },
                                    function (err) {
                                        console.error(
                                            "Async: Could not copy text: ",
                                            err
                                        );
                                    }
                                );
                        }}
                    >
                        <h1>copy</h1>
                    </div>
                {/if}
                <div class="text">
                    {dir.path}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    * {
        box-sizing: border-box;
    }
    h3 {
        color: blue;
        cursor: pointer;
    }
    .main {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
        max-width: 760px;
        margin: 0 auto;
        width: 100%;
        border: 2px solid black;
        padding: 20px;
        padding-top: 0;
    }
    .box {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
    }
    .box > div {
        position: relative;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 200px;
        border: 2px solid black;
        padding: 10px;
        transition: 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .box > div:hover {
        transform: translateY(-10px);
        text-decoration: underline;
    }
    .box > div > div.text {
        padding-top: 10px;
    }
    .box .copy {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.413);
        opacity: 0;
        transition: cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
    }
    .box > div:hover > .copy {
        opacity: 1;
        z-index: 1000;
    }
    .box .copy h1 {
        background-color: black;
        color: white;
        padding: 20px;
        padding-top: 10px;
        padding-bottom: 16px;
        border-radius: 10px;
        line-height: 0.8;
        font-size: 20px;
    }
    img.ico {
        width: 100%;
        aspect-ratio: 1;
    }
</style>
