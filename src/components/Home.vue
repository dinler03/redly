<template>
    <TopAppBar ref="topbar" :subreddit="feed_label" @params_changed="params_changed" />
    <div class="d-flex dps-16 dpb-8 md-background">
        <div class="chips-container" :checked="feed_mode == 'popular'" @click.passive="switch_feed('popular')">
            <span class="material-icons"></span>
            <span class="label-large">{{ t('popular') }}</span>
        </div>
        <div class="chips-container" :checked="feed_mode == 'following'" @click.passive="switch_feed('following')">
            <span class="material-icons"></span>
            <span class="label-large">{{ t('following') }}</span>
        </div>
    </div>
    <div v-if="loading" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle md-background p-2">
            <div class="spinner-border text-4" role="status"></div>
        </div>
    </div>
    <div v-else-if="empty_following" class="d-flex flex-column justify-content-center align-items-center cover-all position-absolute text-4 dpx-16 text-center">
        <span class="material-icons dpb-8" style="font-size: 48px;">bookmarks</span>
        <span class="body-large dpb-4">{{ t('no_following') }}</span>
        <span class="label-large dpb-16">{{ t('no_following_hint') }}</span>
        <div class="md-filled-button-with-icon bg-10 text-4" @click.passive="go_explore">
            <span class="material-icons">explore</span>
            <span class="label-large">{{ t('explore') }}</span>
        </div>
    </div>
    <div v-else-if="error" class="d-flex flex-column justify-content-center align-items-center cover-all position-absolute text-4">
        <span class="material-icons dpb-8" style="font-size: 48px;">wifi_off</span>
        <span class="body-large dpb-16">{{ t('could_not_load') }}</span>
        <div class="md-filled-button-with-icon bg-10 text-4" @click.passive="retry">
            <span class="material-icons">refresh</span>
            <span class="label-large">{{ t('retry') }}</span>
        </div>
    </div>
    <template v-else>
        <div class="cards dpb-16">
            <Post v-for="post in posts" :post="post.data" />
        </div>
        <div v-show="!scroll_loaded" class="md-progress-container">
            <div class="md-progress">
                <div class="md-progress-indicator"></div>
            </div>
        </div>
    </template>
</template>

<script setup>
import { ref, computed, onBeforeMount, onActivated, onDeactivated } from 'vue';
import { useRouter } from 'vue-router';
import { Redly } from "/js/redly.js";
import { t } from '/js/i18n.js';
import Post from './CompactPost.vue';
import TopAppBar from './TopAppBar.vue';

const router = useRouter();
const redly = new Redly();
const topbar = ref(null);

const posts = ref([]);
const after = ref(null);
const feed_mode = ref('popular');
const loading = ref(true);
const error = ref(false);
const empty_following = ref(false);

const scroll_loaded = ref(true);

const feed_label = computed(() => feed_mode.value === 'following' ? t('following') : t('popular'));

function get_followed_subs() {
    try {
        const raw = localStorage.getItem("subreddits");
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function get_subreddit_param() {
    if (feed_mode.value === 'following') {
        const subs = get_followed_subs();
        if (subs.length === 0) return null;
        return subs.map(s => typeof s === 'string' ? s : s.display_name).filter(Boolean).join('+');
    }
    return "popular";
}

async function setup() {
    loading.value = true;
    error.value = false;
    empty_following.value = false;

    const param = get_subreddit_param();
    // Following mode with no followed subs: show empty state, do not fetch.
    if (feed_mode.value === 'following' && !param) {
        posts.value = [];
        after.value = null;
        empty_following.value = true;
        loading.value = false;
        return;
    }

    let response = await redly.getSubmissions("hot", param, {
        t: "day"
    });
    if (!response) {
        loading.value = false;
        error.value = true;
        return;
    }

    posts.value = response.posts;
    after.value = response.after;
    loading.value = false;
}

async function get_posts() {
    loading.value = true;
    error.value = false;
    empty_following.value = false;

    const param = get_subreddit_param();
    if (feed_mode.value === 'following' && !param) {
        posts.value = [];
        after.value = null;
        empty_following.value = true;
        loading.value = false;
        return;
    }

    let response = await redly.getSubmissions(topbar.value.sort, param, {
        t: topbar.value.time
    });
    if (!response) {
        loading.value = false;
        error.value = true;
        return;
    }

    posts.value = response.posts;
    after.value = response.after;
    loading.value = false;
}

async function retry() {
    setup();
}

async function go_explore() {
    router.push('/search');
}

async function scroll() {
    if (empty_following.value) return;

    scroll_loaded.value = false;

    const param = get_subreddit_param();
    if (feed_mode.value === 'following' && !param) {
        scroll_loaded.value = true;
        return;
    }

    let response = await redly.getSubmissions(topbar.value.sort, param, {
        after: after.value,
        t: topbar.value.time
    });
    if (!response || !response.posts.length) {
        after.value = null;
        scroll_loaded.value = true;
        return
    }

    posts.value.push(...response.posts);
    after.value = response.after;

    scroll_loaded.value = true;
}

async function switch_feed(mode) {
    if (feed_mode.value === mode) return;
    feed_mode.value = mode;
    posts.value = [];
    after.value = null;
    scroll_loaded.value = true;
    setup();
}

async function params_changed() {
    posts.value = [];
    after.value = null;
    scroll_loaded.value = true;
    get_posts();
}

function scroll_handle(el) {
    if (el.target.scrollTop + el.target.clientHeight >= el.target.scrollHeight - window.innerWidth && scroll_loaded.value && after.value) {
        scroll();
    }
}

onBeforeMount(() => {
    setup();
})

onActivated(() => {
    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', scroll_handle)

    // If we're on Following and the user just added subs elsewhere, refresh.
    if (feed_mode.value === 'following' && empty_following.value && get_subreddit_param()) {
        setup();
        return;
    }

    // Scroll to the last position
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }
})

onDeactivated(() => {
    // Disable scroll event listener
    let view = document.querySelector('.content-view');
    view.removeEventListener('scroll', scroll_handle);
})
</script>