import { initRouter } from './router.js';
import { state } from './state.js';
import { fetchAttractions } from './services/attractionsService.js';
import { useGeolocation } from './hooks/useGeolocation.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load User Profile Preferences & Theme
    const profile = state.get('userProfile');
    if (profile && profile.theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // 2. Fetch Attractions Data
    state.set('loading', true);
    try {
        const attractions = await fetchAttractions();
        state.set('attractions', attractions);
    } catch (err) {
        state.set('error', 'Failed to load attractions. Please check your connection.');
    } finally {
        state.set('loading', false);
    }

    // 3. Request Geolocation if set to browser mode
    if (profile && profile.locationMode === 'browser') {
        useGeolocation((pos) => {
            // Set browser coordinates
            state.set('userLocation', { lat: pos.coords.latitude, lng: pos.coords.longitude });
        }, (err) => {
            console.warn('Geolocation access failed or denied:', err);
            // Fallback: use simulated location in profile
            state.set('userLocation', { lat: Number(profile.simulatedLat), lng: Number(profile.simulatedLng) });
        });
    }

    // 4. Initialize Router
    initRouter();
});
