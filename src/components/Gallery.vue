<template>
    <div class="d-flex flex-column">
        <div class="m-3">
            <h5 class="text-6 mb-0">{{ t('gallery') }}</h5>
        </div>
        <div class="display-flex justify-content-center p-3" v-show="!images.length">
            <span class="title-medium text-4">{{ t('no_images') }}</span>
        </div>
        <div v-show="edit_mode">
            <div class="d-flex mb-1">
                <button class="btn btn-touch" @click.passive="delete_images">
                    <div class="d-flex flex-column text-6 btn-touch">
                        <span class="bi bi-trash-fill"></span>
                        <span>{{ t('delete_action') }}</span>
                    </div>
                </button>
                <button class="btn btn-touch ms-2" @click.passive="download_selected" :disabled="!selected_items.length">
                    <div class="d-flex flex-column text-6 btn-touch">
                        <span class="material-icons" style="font-size:1.1rem">download</span>
                        <span>{{ selected_items.length ? t('download_selected').replace('{n}', selected_items.length) : t('download') }}</span>
                    </div>
                </button>
            </div>
        </div>
        <div class="row row-cols-4 g-1">
            <div v-for="image in images" class="col col-gallery position-relative">
                <img :src="image.src" class="img-gallery" @click.passive="clicked(image)"
                    @contextmenu.prevent="right_clicked(image)">
                <div v-show="edit_mode" class="position-absolute top-0 start-0 m-2">
                    <div class="theme-shadow" :class="get_edit_style(image)" />
                </div>
                <div v-show="!edit_mode" class="gallery-download-btn"
                    @click.stop="download_single(image)">
                    <span class="material-icons">download</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated, onDeactivated } from 'vue';
import { t } from '/js/i18n.js';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { open_gallery_viewer } from "/js/event.js";
import { ensure_storage_permission } from '/js/util.js';

const images = ref([]);
const edit_mode = ref(false);
const selected_items = ref([]);

async function download_single(image) {
    if (!(await ensure_storage_permission(Filesystem, Toast))) return false;
    try {
        const file = await Filesystem.readFile({
            path: `redly/${image.name}`,
            directory: Directory.Documents
        });
        await Filesystem.writeFile({
            path: `Pictures/Redly/${image.name}`,
            data: file.data,
            directory: Directory.ExternalStorage,
            recursive: true
        });
        Toast.show({ text: t('saved_to_gallery').replace('{name}', image.name), duration: 'short' });
        return true;
    } catch (e) {
        Toast.show({ text: t('download_failed'), duration: 'short' });
        console.error(e);
        return false;
    }
}

async function download_selected() {
    if (!selected_items.value.length) return;
    if (!(await ensure_storage_permission(Filesystem, Toast))) return;
    const items = [...selected_items.value];
    let ok = 0;
    for (const name of items) {
        const image = images.value.find(i => i.name === name);
        if (!image) continue;
        // sequential to avoid permission race & high base64 memory
        const success = await download_single(image);
        if (success) ok++;
    }
    if (ok === items.length) {
        Toast.show({ text: t('images_saved').replace('{n}', ok), duration: 'short' });
    } else {
        Toast.show({ text: t('some_failed'), duration: 'short' });
    }
}

async function delete_image(fname) {
    return Filesystem.deleteFile({
        path: "redly/" + fname,
        directory: Directory.Documents
    });
}

async function delete_images() {
    const items = [...selected_items.value];
    try {
        await Promise.all(items.map(item => delete_image(item)));
    } catch (e) {
        console.error("Delete failed", e);
    }
    edit_mode.value = false;
    selected_items.value = [];
    await load_images();
}

function get_edit_style(image) {
    if (selected_items.value.includes(image.name)) {
        return 'checked'
    }
    return 'unchecked'
}

async function right_clicked(image) {
    if (!edit_mode.value) {
        edit_mode.value = true;
    }

    if (selected_items.value.includes(image.name)) {
        selected_items.value = selected_items.value.filter(item => item != image.name);
        if (!selected_items.value.length)
            edit_mode.value = false;
        return;
    }
    selected_items.value.push(image.name);
}

async function load_images() {
    let response = await Filesystem.readdir({
        path: "redly/",
        directory: Directory.Documents
    });

    images.value = response.files.map(f => ({
        uri: f.uri,
        name: f.name,
        src: Capacitor.convertFileSrc(f.uri)
    }));
}

async function clicked(image) {
    if (!edit_mode.value) {
        open_gallery_viewer({
            src: image.src,
            uri: image.uri,
            id: image.name.split("_")[1].split(".")[0],
        });
        return
    }

    if (selected_items.value.includes(image.name)) {
        selected_items.value = selected_items.value.filter(item => item != image.name);
        if (!selected_items.value.length)
            edit_mode.value = false;
        return;
    }
    selected_items.value.push(image.name);
}

onActivated(() => {
    load_images();
})

onDeactivated(() => {
    edit_mode.value = false;
    selected_items.value = [];
})
</script>