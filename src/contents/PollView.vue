<template>
    <div class="poll-container p-3">
        <div v-for="option in options_with_pct" :key="option.id" class="mb-2">
            <div class="d-flex justify-content-between label-medium text-4 mb-1">
                <span>{{ option.text }}</span>
                <span>{{ option.pct }}%</span>
            </div>
            <div class="progress" style="height: 6px">
                <div class="progress-bar bg-11" :style="{ width: option.pct + '%' }"></div>
            </div>
        </div>
        <div class="label-medium text-4 mt-2">
            {{ t('poll_votes').replace('{n}', format_num(poll_data.total_vote_count)) }} · {{ is_active ? t('poll_active') : t('poll_ended') }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { t } from '/js/i18n.js';

const props = defineProps({
    poll_data: {
        type: Object,
        required: true
    }
});

const is_active = computed(() =>
    Date.now() < props.poll_data.voting_end_timestamp
);

const options_with_pct = computed(() => {
    const total = props.poll_data.total_vote_count || 1;
    return props.poll_data.options.map(o => ({
        ...o,
        pct: Math.round((o.vote_count || 0) / total * 100)
    }));
});

function format_num(n) {
    if (n > 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n > 1000) return (n / 1000).toFixed(1) + 'K';
    return n;
}
</script>
