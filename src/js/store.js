// store.js

import { reactive } from "vue";

const store = reactive({
    hidden: JSON.parse(localStorage.getItem('hidden_posts')) || [],
    title_size: JSON.parse(localStorage.getItem("title_size")) || 'title-medium',
    nsfw_filter: JSON.parse(localStorage.getItem("nsfw_filter")) || 'hide',
    theme: JSON.parse(localStorage.getItem("theme")) || 'dark',
    load_media: JSON.parse(localStorage.getItem("load_media")) ?? true,
    saved_posts: JSON.parse(localStorage.getItem("saved_posts")) || [],
})

async function hide(id) {
    store.hidden.push(id);
}

async function unhide(id) {
    store.hidden = store.hidden.filter(post_id => post_id != id);
}

function save_hidden() {
    localStorage.setItem('hidden_posts', JSON.stringify(store.hidden))
}

async function clear_hidden() {
    store.hidden = [];
}

async function is_hidden(id) {
    return store.hidden.includes(id);
}

function save_post(post) {
    if (!store.saved_posts.find(p => p.id === post.id)) {
        store.saved_posts.push({
            id: post.id,
            title: post.title,
            subreddit: post.subreddit,
            author: post.author,
            score: post.score,
            num_comments: post.num_comments,
            permalink: post.permalink,
            created: post.created,
            over_18: post.over_18,
        });
        localStorage.setItem('saved_posts', JSON.stringify(store.saved_posts));
    }
}

function unsave_post(id) {
    store.saved_posts = store.saved_posts.filter(p => p.id !== id);
    localStorage.setItem('saved_posts', JSON.stringify(store.saved_posts));
}

function is_saved(id) {
    return store.saved_posts.some(p => p.id === id);
}

export { store, hide, unhide, is_hidden, save_hidden, clear_hidden, save_post, unsave_post, is_saved }