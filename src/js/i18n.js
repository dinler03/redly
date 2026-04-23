// i18n.js — Simple reactive translation system

import { reactive, computed } from "vue";

const translations = {
    en: {
        // Navigation
        home: "Home",
        search: "Search",
        subs: "Subs",
        profile: "Profile",

        // Home
        popular: "Popular",
        following: "Following",
        could_not_load: "Could not load posts",
        retry: "Retry",

        // Search
        search_reddit: "Search Reddit",
        search_subreddits: "Search Subreddits",
        explore_subs: "Explore and follow some subreddits!",

        // Following empty state
        no_following: "You're not following any subreddits yet",
        no_following_hint: "Find communities and tap Follow to add them here.",
        explore: "Explore subreddits",

        // Post actions
        share: "Share",
        save: "Save",
        saved: "Saved",
        hide: "Hide",
        open: "Open",
        close: "Close",
        comments: "Comments",
        nsfw: "NSFW",
        nsfw_tap: "NSFW — Tap to reveal",
        delete_action: "Delete",
        remove: "Remove",

        // Settings
        autoplay: "Autoplay",
        check_for_updates: "Check for updates",
        in_app_browser: "Use in-app browser",
        load_media: "Load media",
        share_old_reddit: "Share old.reddit links",
        theme: "Theme",
        dark: "Dark",
        light: "Light",
        nsfw_content: "NSFW Content",
        blur: "Blur",
        show: "Show",
        title_size: "Title size",
        large: "Large",
        medium: "Medium",
        small: "Small",
        language: "Language",
        made_by: "Made by users, for the users.",
        report_bug: "Report a bug",

        // Subreddit
        members: "members",
        online: "online",
        follow: "Follow",

        // User
        overview: "Overview",
        posts: "Posts",
        karma: "karma",

        // TopAppBar
        sort_options: "Sort options",
        best: "Best",
        hot: "Hot",
        new_sort: "New",
        rising: "Rising",
        controversial: "Controversial",
        top: "Top",
        past_hour: "Past hour",
        past_24h: "Past 24 hours",
        past_week: "Past week",
        past_month: "Past month",
        past_year: "Past year",
        all_time: "All time",
        scroll_to_top: "Scroll to top",
        refresh: "Refresh",
        clear_hidden: "Clear hidden posts",

        // Gallery
        gallery: "Gallery",
        no_images: "No images found.",
        download: "Download",
        download_selected: "Download ({n})",
        saved_to_gallery: "Saved: Redly/{name}",
        download_failed: "Download failed",
        images_saved: "{n} image(s) saved",
        some_failed: "Some images could not be downloaded",
        permission_denied: "Storage permission denied",

        // Video download
        video_url_missing: "Video URL not found",
        downloading: "Downloading...",
        video_saved: "Video saved: Redly/{name}",
        save_failed: "Save failed",

        // Poll
        poll_active: "Ongoing",
        poll_ended: "Ended",
        poll_votes: "{n} votes",

        // Saved
        saved_posts: "Saved Posts",
        no_saved: "No saved posts yet",

        // Update
        update_available: "A new version of Redly is available!",
        update: "Update",
        dont_ask: "Don't ask again",
        update_check_warning: "Redly will contact api.github.com to check for new releases. If you installed Redly from F-Droid, F-Droid already handles updates for you and this option will bypass it. Enable anyway?",

        // App
        press_back: "Press back again to exit",

        // Date format (relative time)
        ago_minutes: "{n}m ago",
        ago_hours: "{n}h ago",
        ago_days: "{n}d ago",
        ago_weeks: "{n}w ago",
        ago_months: "{n}mo ago",
        ago_years: "{n}y ago",

        // ImageViewer
        download_complete: "Saved: {name}",

        // Options dropdown
        options: "Options",
        options_refresh: "Refresh",

        // UpdateManager
        update_body_info: "Clicking the update button will download the latest release from our GitHub repository and bypass F-Droid's checks if you have downloaded the app from there.",
        update_close: "Close",

        // Settings — branding
        app_tagline: "Reddit, quietly.",
        contributors: "Redly Contributors",

        // Misc
        image_missing: "Image Missing",
    },
    tr: {
        // Navigation
        home: "Ana Sayfa",
        search: "Ara",
        subs: "Takip",
        profile: "Profil",

        // Home
        popular: "Popüler",
        following: "Takip",
        could_not_load: "Gönderiler yüklenemedi",
        retry: "Tekrar Dene",

        // Search
        search_reddit: "Reddit'te Ara",
        search_subreddits: "Subreddit Ara",
        explore_subs: "Subreddit'leri keşfet ve takip et!",

        // Following empty state
        no_following: "Henüz takip ettiğin bir subreddit yok",
        no_following_hint: "Subreddit'leri keşfet ve takip et tuşuna basarak buraya ekle.",
        explore: "Subreddit'leri keşfet",

        // Post actions
        share: "Paylaş",
        save: "Kaydet",
        saved: "Kaydedildi",
        hide: "Gizle",
        open: "Aç",
        close: "Kapat",
        comments: "Yorumlar",
        nsfw: "NSFW",
        nsfw_tap: "NSFW — Görmek için dokun",
        delete_action: "Sil",
        remove: "Kaldır",

        // Settings
        autoplay: "Otomatik oynat",
        check_for_updates: "Güncellemeleri kontrol et",
        in_app_browser: "Uygulama içi tarayıcı",
        load_media: "Medya yükle",
        share_old_reddit: "old.reddit linkleri paylaş",
        theme: "Tema",
        dark: "Koyu",
        light: "Açık",
        nsfw_content: "NSFW İçerik",
        blur: "Bulanık",
        show: "Göster",
        title_size: "Başlık boyutu",
        large: "Büyük",
        medium: "Orta",
        small: "Küçük",
        language: "Dil",
        made_by: "Kullanıcılar tarafından, kullanıcılar için.",
        report_bug: "Hata bildir",

        // Subreddit
        members: "üye",
        online: "çevrimiçi",
        follow: "Takip Et",

        // User
        overview: "Genel",
        posts: "Gönderiler",
        karma: "karma",

        // TopAppBar
        sort_options: "Sıralama seçenekleri",
        best: "En İyi",
        hot: "Popüler",
        new_sort: "Yeni",
        rising: "Yükselen",
        controversial: "Tartışmalı",
        top: "En Çok",
        past_hour: "Son 1 saat",
        past_24h: "Son 24 saat",
        past_week: "Son 1 hafta",
        past_month: "Son 1 ay",
        past_year: "Son 1 yıl",
        all_time: "Tüm zamanlar",
        scroll_to_top: "Başa dön",
        refresh: "Yenile",
        clear_hidden: "Gizlenen gönderileri temizle",

        // Gallery
        gallery: "Galeri",
        no_images: "Görsel bulunamadı.",
        download: "İndir",
        download_selected: "İndir ({n})",
        saved_to_gallery: "Kaydedildi: Redly/{name}",
        download_failed: "İndirme başarısız",
        images_saved: "{n} görsel kaydedildi",
        some_failed: "Bazı görseller indirilemedi",
        permission_denied: "Depolama izni reddedildi",

        // Video download
        video_url_missing: "Video URL bulunamadı",
        downloading: "İndiriliyor...",
        video_saved: "Video kaydedildi: Redly/{name}",
        save_failed: "Kaydetme başarısız",

        // Poll
        poll_active: "Devam ediyor",
        poll_ended: "Tamamlandı",
        poll_votes: "{n} oy",

        // Saved
        saved_posts: "Kaydedilen Gönderiler",
        no_saved: "Henüz kaydedilen gönderi yok",

        // Update
        update_available: "Redly'nin yeni bir sürümü mevcut!",
        update: "Güncelle",
        dont_ask: "Bir daha sorma",
        update_check_warning: "Redly yeni sürümleri kontrol etmek için api.github.com'a bağlanacak. Eğer Redly'yi F-Droid'den yüklediyseniz, güncellemeleri zaten F-Droid yönetiyor ve bu seçenek onu devre dışı bırakır. Yine de açılsın mı?",

        // App
        press_back: "Çıkmak için tekrar geri basın",

        // Date format (relative time)
        ago_minutes: "{n}dk önce",
        ago_hours: "{n}sa önce",
        ago_days: "{n}g önce",
        ago_weeks: "{n}h önce",
        ago_months: "{n}ay önce",
        ago_years: "{n}y önce",

        // ImageViewer
        download_complete: "Kaydedildi: {name}",

        // Options dropdown
        options: "Seçenekler",
        options_refresh: "Yenile",

        // UpdateManager
        update_body_info: "Güncelle düğmesine basmanız GitHub deposundan en son sürümü indirecektir. Eğer uygulamayı F-Droid üzerinden yüklediyseniz, bu işlem F-Droid'in güncelleme kontrolünü atlar.",
        update_close: "Kapat",

        // Settings — branding
        app_tagline: "Reddit, sessizce.",
        contributors: "Redly Katkıda Bulunanları",

        // Misc
        image_missing: "Görsel Bulunamadı",
    }
};

const state = reactive({
    lang: JSON.parse(localStorage.getItem("language")) || "en"
});

function t(key) {
    return translations[state.lang]?.[key] || translations.en[key] || key;
}

function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem("language", JSON.stringify(lang));
}

function useI18n() {
    return {
        t,
        lang: computed(() => state.lang),
        setLanguage,
    };
}

export { useI18n, t, setLanguage };
