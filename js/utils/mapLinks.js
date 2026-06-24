import { state } from '../state.js';

export const buildMapLink = (lat, lng, label) => {
    const profile = state.get('userProfile');
    const mapsPref = profile ? profile.mapsPref : 'gmaps';
    const encodedLabel = encodeURIComponent(label);

    if (mapsPref === 'geo') {
        return `geo:${lat},${lng}?q=${lat},${lng}(${encodedLabel})`;
    }
    
    // Default fallback: Google Maps Web link (which automatically launches Google Maps app on iOS/Android)
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};
