export const useGeolocation = (onSuccess, onError) => {
    if (!('geolocation' in navigator)) {
        if (onError) onError(new Error('Geolocation is not supported by your browser'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
};
