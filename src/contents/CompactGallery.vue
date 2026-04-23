<template>
    <div class="wrapper" ref="wrapper_el">
        <div v-for="(image, idx) in images" :key="idx">
            <img :src="image.preview" :style="image.style" @click="(e) => handle_click(e, image)">
            <div class="position-absolute top-0 end-0 m-2">
                <div class="d-flex position-relative">
                    <div class="position-absolute background cover-all opacity-75 rounded"></div>
                    <small class="gallery-indicator position-relative text-4 px-1" :length="images.length"></small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { open_image_viewer } from '/js/event.js';
import { create_click_debouncer } from '/js/util.js';

const emit = defineEmits(['open_post']);
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const images = ref([]);
const wrapper_el = ref(null);

function open_image(img) {
    open_image_viewer({
        src: img.src,
        title: props.data.title,
        id: props.data.id,
        num_comments: props.data.num_comments
    });
}

// Single click → open post detail; double click → fullscreen viewer
const _click_debouncers = new WeakMap();
function handle_click(event, image) {
    let fn = _click_debouncers.get(image);
    if (!fn) {
        fn = create_click_debouncer(
            () => emit('open_post'),
            () => open_image(image)
        );
        _click_debouncers.set(image, fn);
    }
    fn(event);
}

async function get_sources() {
    if (!props.data.gallery_data) return;

    let order = props.data.gallery_data.items.map(item => item.media_id);
    let items = order
        .map(id => props.data.media_metadata?.[id])
        .filter(Boolean);

    images.value = items.map(item => {
        const previews = Array.isArray(item.p) ? item.p : [];
        const best_preview = previews.length ? previews[previews.length - 1] : null;
        const src_url = item.s?.u
            ? item.s.u.split("?")[0].replace("preview", "i").replaceAll("&amp;", "&")
            : (item.s?.gif || best_preview?.u || '');
        const preview_url = best_preview
            ? best_preview.u.replaceAll("&amp;", "&")
            : src_url;
        const dims = best_preview
            ? { w: best_preview.x, h: best_preview.y }
            : { w: item.s?.x || 1, h: item.s?.y || 1 };
        return {
            src: src_url,
            preview: preview_url,
            style: { 'aspect-ratio': `${dims.w} / ${dims.h}` }
        };
    });
}

// setup
get_sources();

onMounted(() => {
    if (wrapper_el.value) wrapper_el.value.scrollLeft = 0;
})
</script>