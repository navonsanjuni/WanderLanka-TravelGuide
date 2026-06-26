import { createEl } from '../utils/dom.js';
import { state } from '../state.js';
import { Header } from '../components/Header.js';
import { BottomNav } from '../components/BottomNav.js';
import { calculateDistance } from '../utils/distance.js';
import { FavoriteButton } from '../components/FavoriteButton.js';

export const renderMapViewPage = () => {
    const wrapper = createEl('div');
    wrapper.appendChild(Header('Map'));

    const splitContainer = createEl('div', { className: 'map-split-container' });
    wrapper.appendChild(splitContainer);

    // Left Panel (Map container)
    const leftPanel = createEl('div', { className: 'map-left-panel' });
    leftPanel.innerHTML = `<div id="leaflet-map"></div>`;
    splitContainer.appendChild(leftPanel);

    // Right Panel (Sidebar for Search & list)
    const rightPanel = createEl('div', { className: 'map-right-panel' });
    splitContainer.appendChild(rightPanel);

    wrapper.appendChild(BottomNav('/map'));

    let mapInstance = null;
    let markersMap = {};
    let activeFilter = 'All';
    let searchQuery = '';

    const initMap = () => {
        const userLocation = state.get('userLocation');
        const defaultCenter = userLocation ? [userLocation.lat, userLocation.lng] : [6.9687, 80.7872]; // Nuwara Eliya center
        const defaultZoom = userLocation ? 13 : 13;

        // Initialize Leaflet Map
        mapInstance = L.map('leaflet-map', {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView(defaultCenter, defaultZoom);

        // Add OSM Tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Render User Location if available
        if (userLocation) {
            const userIcon = L.divIcon({
                className: 'leaflet-user-beacon',
                html: '<div class="user-beacon"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, title: 'Your Location' }).addTo(mapInstance);
        }

        updateMarkers();
    };

    const updateMarkers = () => {
        if (!mapInstance) return;

        // Clear existing markers
        Object.values(markersMap).forEach(marker => mapInstance.removeLayer(marker));
        markersMap = {};

        const attractions = state.get('attractions') || [];
        const filtered = filterAttractions(attractions);

        filtered.forEach(attr => {
            const popupHtml = `
                <div style="font-family: var(--font-family); max-width: 200px;">
                    <img src="${attr.image}" style="width:100%; height:100px; object-fit:cover; border-radius:4px; margin-bottom:6px;">
                    <h4 style="margin:0 0 2px 0; font-weight:700; font-size:14px;">${attr.name}</h4>
                    <a href="#/attraction/${attr.id}" style="color:var(--color-primary); font-weight:600; font-size:12px; text-decoration:none; display: inline-block; margin-top: 4px;">View Details &rarr;</a>
                </div>
            `;

            const marker = L.marker([attr.lat, attr.lng])
                .addTo(mapInstance)
                .bindPopup(popupHtml);

            marker.on('click', () => {
                mapInstance.flyTo([attr.lat, attr.lng], 12);
                highlightListItem(attr.id);
            });

            markersMap[attr.id] = marker;
        });
    };

    const filterAttractions = (list) => {
        let result = list || [];
        if (activeFilter !== 'All') {
            result = result.filter(a => a.category === activeFilter);
        }
        if (searchQuery) {
            result = result.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return result;
    };

    const highlightListItem = (id) => {
        const items = rightPanel.querySelectorAll('.map-list-item');
        items.forEach(item => {
            if (item.getAttribute('data-id') === id) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    };

    const renderList = () => {
        const attractions = state.get('attractions') || [];
        const userLocation = state.get('userLocation');
        const filtered = filterAttractions(attractions);

        // Keep or update Search inputs
        rightPanel.innerHTML = `
            <div class="map-search-section">
                <div class="map-search-bar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="map-search-input" placeholder="Search attractions..." value="${searchQuery}">
                </div>
                <div class="map-filter-chips">
                    <button class="map-chip ${activeFilter === 'All' ? 'active' : ''}" data-cat="All">All Sites</button>
                    <button class="map-chip ${activeFilter === 'Nature' ? 'active' : ''}" data-cat="Nature">Nature</button>
                    <button class="map-chip ${activeFilter === 'Historical' ? 'active' : ''}" data-cat="Historical">Historical</button>
                    <button class="map-chip ${activeFilter === 'Hotels' ? 'active' : ''}" data-cat="Hotels">Hotels</button>
                </div>
            </div>
            
            <h3 class="map-list-title">Top Attractions Near You</h3>
            
            <div class="map-list-scroll">
                ${filtered.length === 0 ? '<p class="empty-state">No spots match your search.</p>' : ''}
            </div>
        `;

        const scrollContainer = rightPanel.querySelector('.map-list-scroll');

        filtered.forEach(attr => {
            let distanceStr = 'Nearby';
            if (userLocation) {
                const dist = calculateDistance(userLocation.lat, userLocation.lng, attr.lat, attr.lng);
                if (dist !== null) distanceStr = `${dist} km away`;
            }

            const item = createEl('div', { 
                className: 'map-list-item',
                attributes: { 'data-id': attr.id }
            });

            item.innerHTML = `
                <img src="${attr.image}" class="map-list-img" alt="${attr.name}">
                <div class="map-list-details">
                    <div class="map-list-name">${attr.name}</div>
                    <div class="map-list-meta">${distanceStr} &bull; ${attr.category}</div>
                </div>
            `;

            // Favorite button directly inside card action area
            const favContainer = createEl('div', { className: 'map-list-actions' });
            const favBtn = FavoriteButton(attr.id);
            favBtn.classList.add('map-list-fav');
            favBtn.addEventListener('click', (e) => e.stopPropagation());
            favContainer.appendChild(favBtn);
            item.appendChild(favContainer);

            // Click listener
            item.addEventListener('click', () => {
                highlightListItem(attr.id);
                const marker = markersMap[attr.id];
                if (marker) {
                    marker.openPopup();
                    mapInstance.flyTo([attr.lat, attr.lng], 13);
                }
            });

            scrollContainer.appendChild(item);
        });

        // Set up search listener
        const searchInput = rightPanel.querySelector('#map-search-input');
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            // Update map markers and list dynamically
            updateMarkers();
            renderListScrollOnly();
        });

        // Set up chip listeners
        rightPanel.querySelectorAll('.map-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                activeFilter = btn.getAttribute('data-cat');
                rightPanel.querySelectorAll('.map-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateMarkers();
                renderListScrollOnly();
            });
        });
    };

    const renderListScrollOnly = () => {
        const attractions = state.get('attractions') || [];
        const userLocation = state.get('userLocation');
        const filtered = filterAttractions(attractions);
        const scrollContainer = rightPanel.querySelector('.map-list-scroll');
        scrollContainer.innerHTML = '';

        if (filtered.length === 0) {
            scrollContainer.innerHTML = '<p class="empty-state">No spots match your search.</p>';
            return;
        }

        filtered.forEach(attr => {
            let distanceStr = 'Nearby';
            if (userLocation) {
                const dist = calculateDistance(userLocation.lat, userLocation.lng, attr.lat, attr.lng);
                if (dist !== null) distanceStr = `${dist} km away`;
            }

            const item = createEl('div', { 
                className: 'map-list-item',
                attributes: { 'data-id': attr.id }
            });

            item.innerHTML = `
                <img src="${attr.image}" class="map-list-img" alt="${attr.name}">
                <div class="map-list-details">
                    <div class="map-list-name">${attr.name}</div>
                    <div class="map-list-meta">${distanceStr} &bull; ${attr.category}</div>
                </div>
            `;

            const favContainer = createEl('div', { className: 'map-list-actions' });
            const favBtn = FavoriteButton(attr.id);
            favBtn.classList.add('map-list-fav');
            favBtn.addEventListener('click', (e) => e.stopPropagation());
            favContainer.appendChild(favBtn);
            item.appendChild(favContainer);

            item.addEventListener('click', () => {
                highlightListItem(attr.id);
                const marker = markersMap[attr.id];
                if (marker) {
                    marker.openPopup();
                    mapInstance.flyTo([attr.lat, attr.lng], 13);
                }
            });

            scrollContainer.appendChild(item);
        });
    };

    renderList();

    // Leaflet initialization hook after DOM mounting
    setTimeout(() => {
        const mapEl = document.getElementById('leaflet-map');
        if (mapEl) {
            initMap();
        }
    }, 50);

    return wrapper;
};
