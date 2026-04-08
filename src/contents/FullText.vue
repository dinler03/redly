<template>
    <div class="text-wrap text-break w-100">
        <div class="position-relative">
            <div class="text-4 text-post full-text-post position-relative" v-html="text"
                @contextmenu.prevent="controls_visible = true" @click="handle_link_click($event)" />
            <div class="text-controls" v-show="controls_visible" @click.passive="controls_visible = false">
                <div class="md-fab md-foreground el-3" @click.passive="translate">
                    <span class="material-icons text-4">translate</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const text = ref(null);
const translated = ref(false);
const controls_visible = ref(false);

const origin = ref(1);          // 0: original, 1: translated
const texts = ref(['', '']);    // original, translated

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

async function get_sources() {
    text.value = decodeHtml(props.data.selftext_html);
}

async function translate() {
    let md = document.querySelector(".md");

    if (!translated.value) {
        texts.value[0] = md.textContent;

        let translation = await fetch("https://lingva.garudalinux.org/api/v1/auto/en/" + encodeURIComponent(texts.value[0]))
            .then(res => res.json())
            .then(res => res.translation)
            .catch(err => null);
        if (!translation) {
            return
        }

        md.innerText = translation
        texts.value[1] = translation;
        translated.value = true;
        return
    }

    origin.value = (origin.value + 1) % 2;
    p.innerText = texts.value[origin.value];
}

function handle_link_click(event) {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('/r/') || href.startsWith('/u/') || href.startsWith('/user/')) {
        event.preventDefault();
        event.stopPropagation();
        const path = href.startsWith('/user/') ? href.replace('/user/', '/u/') : href;
        router.push(path);
        return;
    }

    const previewMatch = href.match(/^https?:\/\/preview\.redd\.it\/([^?]+)/);
    if (previewMatch) {
        event.preventDefault();
        event.stopPropagation();
        const parts = previewMatch[1].split('.');
        if (parts.length >= 2) {
            router.push(`/preview/${parts[0]}/${parts[1]}`);
        }
        return;
    }

    const iRedditMatch = href.match(/^https?:\/\/i\.redd\.it\/([^?]+)/);
    if (iRedditMatch) {
        event.preventDefault();
        event.stopPropagation();
        const parts = iRedditMatch[1].split('.');
        if (parts.length >= 2) {
            router.push(`/preview/${parts[0]}/${parts[1]}`);
        }
        return;
    }

    const fullUrlMatch = href.match(/^https?:\/\/(www\.|old\.|new\.)?reddit\.com(\/.*)/);
    if (fullUrlMatch) {
        event.preventDefault();
        event.stopPropagation();
        let path = fullUrlMatch[2];
        const commentsMatch = path.match(/\/(?:r\/[^\/]+\/)?comments\/([^\/]+)/);
        if (commentsMatch) {
            router.push(`/post/${commentsMatch[1]}`);
            return;
        }
        path = path.replace(/^\/user\//, '/u/');
        router.push(path);
        return;
    }
}

// setup
get_sources();
</script>