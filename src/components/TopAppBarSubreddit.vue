<template>
    <div class="top-app-bar sticky-top">
        <div class="top-app-bar-headline">
            <span class="title-large text-break text-truncate">{{ props.subreddit }}</span>
        </div>
        <div class="top-app-bar-trailing-icons">
            <div class="top-app-bar-trailing-icon-container position-relative" @touchstart.prevent="open_menu_options">
                <span class="top-app-bar-trailing-icon material-icons">more_vert</span>
                <div class="menu" v-show="menu_visible" @touchstart.prevent="close_menu_options">
                    <div class="menu-container">
                        <div class="menu-item" @touchstart.prevent="scroll_top">
                            <span class="material-icons">move_up</span>
                            <span class="label-large">{{ t('scroll_to_top') }}</span>
                        </div>
                        <div class="menu-item" @touchstart.prevent="refresh">
                            <span class="material-icons">refresh</span>
                            <span class="label-large">{{ t('refresh') }}</span>
                        </div>
                        <div class="menu-item" @touchstart.prevent="clear_hidden">
                            <span class="material-icons">restore</span>
                            <span class="label-large">{{ t('clear_hidden') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex dps-16 dpb-16 md-background">
        <div class="chips-container" @touchstart.stop="open_dialog">
            <span class=" material-icons">sort</span>
            <span class="label-large">{{ t(display_key) }}</span>
        </div>
    </div>
    <div class="dialog" v-show="dialog_visible" @touchstart.stop="close_dialog">
        <div class="dialog-container">
            <div class="dialog-title">
                <span class="headline-small">{{ t('sort_options') }}</span>
            </div>
            <div v-show="tab == 'sort'" class="list-container py-0">
                <div class="list-item" v-for="sort_type in sort_types" @touchstart.stop="change_sort(sort_type)">
                    <div class="list-item-leading-icon">
                        <span class="material-icons">{{ sort_type.icon }}</span>
                    </div>
                    <span class="body-large">{{ t(sort_type.key) }}</span>
                    <div class="list-item-trailing-icon"
                        v-show="sort_type.value == 'top' || sort_type.value == 'controversial'">
                        <span class="material-icons">arrow_right</span>
                    </div>
                </div>
            </div>
            <div v-show="tab == 'time'" class="list-container py-0">
                <div class="list-item" v-for="time_type in time_types" @touchstart.stop="change_time(time_type)">
                    <div class="list-item-leading-icon">
                        <span class="material-icons">{{ time_type.icon }}</span>
                    </div>
                    <span class="body-large">{{ t(time_type.key) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { clear_hidden } from '/js/store.js';
import { useRouter } from 'vue-router';
import { t } from '/js/i18n.js';

const router = useRouter();

const sort = ref("hot");
const time = ref("day");
const display_key = ref("hot");

const tab = ref('sort');
const temp_sort = ref("hot");
const temp_display_key = ref("hot");

const menu_visible = ref(false);
const dialog_visible = ref(false);

const emit = defineEmits(['params_changed'])

const props = defineProps({
    subreddit: {
        type: String,
        required: false
    }
})

defineExpose({
    sort,
    time
})

const sort_types = [
    { key: "best", value: "best", icon: "rocket_launch" },
    { key: "hot", value: "hot", icon: "local_fire_department" },
    { key: "new_sort", value: "new", icon: "schedule" },
    { key: "rising", value: "rising", icon: "moving" },
    { key: "controversial", value: "controversial", icon: "forum" },
    { key: "top", value: "top", icon: "leaderboard" },
]

const time_types = [
    { key: "past_hour", value: "hour", icon: "history" },
    { key: "past_24h", value: "day", icon: "today" },
    { key: "past_week", value: "week", icon: "date_range" },
    { key: "past_month", value: "month", icon: "calendar_month" },
    { key: "past_year", value: "year", icon: "event_note" },
    { key: "all_time", value: "all", icon: "stars" },
]

async function open_menu_options(event) {
    event.stopPropagation();
    menu_visible.value = true;
}

async function close_menu_options(event) {
    event.stopPropagation();
    menu_visible.value = false;
}

async function open_dialog() {
    dialog_visible.value = true;
}

async function close_dialog() {
    dialog_visible.value = false;

    // reset to default
    tab.value = "sort";
    temp_sort.value = "hot";
    temp_display_key.value = "hot";
}

async function refresh() {
    router.go();
}

async function change_sort(sort_type) {
    display_key.value = sort_type.key;

    if (sort_type.value == 'top' || sort_type.value == 'controversial') {
        temp_display_key.value = sort_type.key;
        temp_sort.value = sort_type.value;
        tab.value = 'time';
        return
    }

    sort.value = sort_type.value;
    emit('params_changed');
    close_dialog();
}

async function change_time(time_type) {
    display_key.value = time_type.key;
    sort.value = temp_sort.value;
    time.value = time_type.value;
    emit('params_changed');
    close_dialog();
}

async function scroll_top() {
    let view = document.querySelector('.content-view');
    view.scroll({
        top: 0,
        behavior: 'smooth'
    });
}
</script>
