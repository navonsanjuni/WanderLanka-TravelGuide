const FAVORITES_KEY = 'nuwaraexplorer_favorites';
const PROFILE_KEY = 'nuwaraexplorer_profile';
const CATEGORY_KEY = 'nuwaraexplorer_category';

const DEFAULT_PROFILE = {
    name: 'Traveler',
    email: 'traveler@example.com',
    travelStyle: 'Nature',
    mapsPref: 'gmaps', // 'gmaps' or 'geo'
    locationMode: 'simulated', // 'browser' or 'simulated'
    simulatedLat: 6.9687, // Nuwara Eliya Lat
    simulatedLng: 80.7872, // Nuwara Eliya Lng
    theme: 'light'
};

export const storageService = {
    getFavorites: () => {
        try {
            const favs = localStorage.getItem(FAVORITES_KEY);
            return favs ? JSON.parse(favs) : [];
        } catch (e) {
            console.error('Error reading favorites from localStorage', e);
            return [];
        }
    },

    isFavorite: (id) => {
        const favs = storageService.getFavorites();
        return favs.includes(id);
    },

    toggleFavorite: (id) => {
        let favs = storageService.getFavorites();
        if (favs.includes(id)) {
            favs = favs.filter(fId => fId !== id);
        } else {
            favs.push(id);
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
        return favs.includes(id);
    },

    getProfile: () => {
        try {
            const profile = localStorage.getItem(PROFILE_KEY);
            return profile ? { ...DEFAULT_PROFILE, ...JSON.parse(profile) } : DEFAULT_PROFILE;
        } catch (e) {
            console.error('Error reading profile from localStorage', e);
            return DEFAULT_PROFILE;
        }
    },

    saveProfile: (profile) => {
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        } catch (e) {
            console.error('Error saving profile to localStorage', e);
        }
    },

    getActiveCategory: () => {
        try {
            return localStorage.getItem(CATEGORY_KEY) || 'All';
        } catch (e) {
            return 'All';
        }
    },

    saveActiveCategory: (category) => {
        try {
            localStorage.setItem(CATEGORY_KEY, category);
        } catch (e) {
            console.error('Error saving category to localStorage', e);
        }
    }
};
