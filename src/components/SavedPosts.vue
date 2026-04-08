<template>
    <div class="top-app-bar">
        <div class="top-app-bar-headline">
            <span class="title-large">{{ t('saved_posts') }}</span>
        </div>
    </div>
    <div v-if="!saved_posts.length" class="d-flex flex-column align-items-center justify-content-center dpy-16 text-4">
        <span class="material-icons" style="font-size: 48px;">bookmark_border</span>
        <span class="body-large dpt-8">{{ t('no_saved') }}</span>
    </div>
    <div class="d-flex flex-column dpx-16 dpb-16">
        <div v-for="post in saved_posts" :key="post.id"
            class="card-container space-between-16 position-relative" @click.passive="open_post(post.id)">
            <div class="card-header">
                <div class="d-flex flex-wrap align-items-center text-4">
                    <span class="label-medium text-11">r/{{ post.subreddit }}</span>
                    <span class="label-medium dmx-4">-</span>
                    <span class="label-medium">u/{{ post.author }}</span>
                </div>
                <span class="text-6 dpy-4 title-medium">{{ post.title }}</span>
                <div class="d-flex align-items-center dpt-4 text-4">
                    <div class="d-flex align-items-center dpe-16">
                        <span class="material-icons dpe-4 text-4" style="font-size: 16px;">arrow_upward</span>
                        <span class="label-medium text-4">{{ format_num(post.score) }}</span>
                    </div>
                    <div class="d-flex align-items-center dpe-16">
                        <span class="material-icons dpe-4 text-4" style="font-size: 16px;">chat</span>
                        <span class="label-medium text-4">{{ format_num(post.num_comments) }}</span>
                    </div>
                    <div class="d-flex align-items-center ct" @click.stop.passive="remove_saved(post.id)">
                        <span class="material-icons dpe-4 ct text-4" style="font-size: 16px;">bookmark_remove</span>
                        <span class="label-medium ct text-4">{{ t('remove') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { store, unsave_post } from '/js/store.js';
import { t } from '/js/i18n.js';

const router = useRouter();

const saved_posts = computed(() => [...store.saved_posts].reverse());

function open_post(id) {
    router.push(`/post/${id}`);
}

function remove_saved(id) {
    unsave_post(id);
}

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}
</script>
