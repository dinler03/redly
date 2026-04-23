<template>
    <img :src="image_options.preview" loading="lazy" :style="image_options.style"
        @click="handle_click">
</template>

<script setup>
import { ref } from 'vue';
import { open_image_viewer } from '/js/event.js';
import { create_click_debouncer } from '/js/util.js';

const emit = defineEmits(['open_post']);
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const image_options = ref({});

function open_viewer() {
    open_image_viewer({
        src: image_options.value.src,
        title: props.data.title,
        id: props.data.id,
        num_comments: props.data.num_comments
    });
}

// Single click → open post detail; double click → fullscreen viewer
const handle_click = create_click_debouncer(
    () => emit('open_post'),
    () => open_viewer()
);

async function get_sources() {
    if (!props.data.preview) {
        const w = props.data.thumbnail?.width || 1;
        const h = props.data.thumbnail?.height || 1;
        image_options.value = {
            src: props.data.url,
            preview: props.data.url,
            style: {
                'aspect-ratio': `${w} / ${h}`
            }
        }
        return;
    }

    const resolutions = props.data.preview.images[0].resolutions;
    const source = props.data.preview.images[0].source;
    const best = resolutions.length
        ? resolutions[resolutions.length - 1]
        : source;

    image_options.value = {
        src: props.data.url,
        preview: best.url.replaceAll("&amp;", "&"),
        style: {
            'aspect-ratio': `${best.width} / ${best.height}`
        }
    }
}

// setup
get_sources();
</script>