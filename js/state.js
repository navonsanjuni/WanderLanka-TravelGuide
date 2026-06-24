import { storageService } from './services/storageService.js';

class State {
    constructor() {
        const profile = storageService.getProfile();
        const category = storageService.getActiveCategory();
        
        let initialUserLocation = null;
        if (profile.locationMode === 'simulated') {
            initialUserLocation = { lat: Number(profile.simulatedLat), lng: Number(profile.simulatedLng) };
        }

        this.data = {
            attractions: [],
            loading: false,
            error: null,
            userLocation: initialUserLocation,
            activeCategory: category,
            searchQuery: '',
            userProfile: profile
        };
        this.listeners = [];
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        
        // Sync specific keys to LocalStorage
        if (key === 'activeCategory') {
            storageService.saveActiveCategory(value);
        } else if (key === 'userProfile') {
            storageService.saveProfile(value);
            
            // If locationMode changed or simulated coordinates updated, update userLocation
            if (value.locationMode === 'simulated') {
                this.data['userLocation'] = { lat: Number(value.simulatedLat), lng: Number(value.simulatedLng) };
            }
        }
        
        this.notify(key, value);
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify(key, value) {
        this.listeners.forEach(listener => listener(key, value, this.data));
    }
}

export const state = new State();
