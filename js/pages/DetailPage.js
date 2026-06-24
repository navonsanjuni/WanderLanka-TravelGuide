import { createEl } from '../utils/dom.js';
import { state } from '../state.js';
import { BottomNav } from '../components/BottomNav.js';
import { buildMapLink } from '../utils/mapLinks.js';
import { calculateDistance } from '../utils/distance.js';
import { FavoriteButton } from '../components/FavoriteButton.js';
import { AttractionCard } from '../components/AttractionCard.js';
import { Footer } from '../components/Footer.js';

export const renderDetailPage = (id) => {
    const wrapper = createEl('div');
    const page = createEl('div', { className: 'page-container detail-view' });
    wrapper.appendChild(page);

    wrapper.appendChild(BottomNav('/'));

    let mapInstance = null;

    const render = () => {
        page.innerHTML = ''; // Clear

        const attractions = state.get('attractions') || [];
        const userLocation = state.get('userLocation');

        if (attractions.length === 0) {
            page.innerHTML = '<p class="loading-spinner">Loading attraction details...</p>';
            return;
        }

        const attraction = attractions.find(a => a.id === id);

        if (!attraction) {
            page.innerHTML = '<p class="error-message">Attraction not found.</p>';
            return;
        }

        // 1. Calculate stats (Distance & estimated time)
        let distanceVal = "Nearby";
        let timeVal = "15 mins";
        
        if (userLocation) {
            const dist = calculateDistance(userLocation.lat, userLocation.lng, attraction.lat, attraction.lng);
            if (dist !== null) {
                distanceVal = `${dist} km`;
                // Assume 1.5 mins driving time per kilometer
                const totalMins = Math.round(dist * 1.5);
                if (totalMins > 60) {
                    const hrs = (totalMins / 60).toFixed(1);
                    timeVal = `${hrs} hours`;
                } else {
                    timeVal = `${totalMins} mins`;
                }
            }
        }

        // 2. Cover image and buttons
        const heroSection = createEl('div', { className: 'detail-hero' });
        heroSection.innerHTML = `
            <a href="#/" class="detail-back-btn" aria-label="Back">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </a>
            <button class="detail-share-btn" aria-label="Share">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
            <img src="${attraction.image}" class="detail-img" alt="${attraction.name}">
        `;

        // Share click feedback
        heroSection.querySelector('.detail-share-btn').addEventListener('click', () => {
            alert(`Link copied to clipboard! Share details of ${attraction.name}.`);
        });

        // Header and Title
        const detailHeader = createEl('div', { className: 'detail-header' });
        detailHeader.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--spacing-sm);">
                <div>
                    <h1 class="detail-title">${attraction.name}</h1>
                    <div class="detail-meta">
                        <span class="tag tag-status" style="position:static;">${attraction.category}</span>
                        <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); font-weight: 700; display: inline-flex; align-items: center; gap: 2px;">
                            <svg class="star-icon" width="12" height="12" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span>4.8 (120 reviews)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Favorite Save action directly beside title section
        const favBtnWrapper = createEl('div', { style: 'margin-top: 4px;' });
        const favBtn = FavoriteButton(attraction.id);
        favBtn.className = 'detail-save-btn';
        favBtnWrapper.appendChild(favBtn);
        detailHeader.firstElementChild.appendChild(favBtnWrapper);

        // 3. Stats Grid
        const statsGrid = createEl('div', { className: 'detail-stats-grid' });
        statsGrid.innerHTML = `
            <div class="detail-stat-box">
                <div class="detail-stat-label">Distance</div>
                <div class="detail-stat-value">${distanceVal}</div>
            </div>
            <div class="detail-stat-box">
                <div class="detail-stat-label">Time to reach</div>
                <div class="detail-stat-value">${timeVal}</div>
            </div>
            <div class="detail-stat-box">
                <div class="detail-stat-label">Status</div>
                <div class="detail-stat-value" style="color: var(--color-success)">Open Now</div>
            </div>
        `;

        // 4. Description
        const descHeader = createEl('h3', { 
            text: 'About this place', 
            className: 'section-title', 
            attributes: { style: 'font-size: var(--font-size-md); margin-bottom: 8px;' } 
        });
        const descParagraph = createEl('p', { className: 'detail-desc', text: attraction.description });

        // 5. Embedded Map Widget
        const mapContainer = createEl('div', { className: 'detail-mini-map-container' });
        mapContainer.innerHTML = `
            <div id="detail-mini-map"></div>
            <a href="#/map" class="mini-map-expand-overlay">Tap to expand map</a>
        `;

        // 6. Action Button Group
        const btnGroup = createEl('div', { className: 'detail-btn-group' });
        
        const directionsBtn = createEl('a', {
            className: 'map-action-btn',
            attributes: { 
                href: buildMapLink(attraction.lat, attraction.lng, attraction.name),
                target: '_blank'
            },
            html: `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                Get Directions
            `
        });

        const tourBtn = createEl('button', {
            className: 'btn-secondary-outline',
            text: 'Book a Guided Tour'
        });

        tourBtn.addEventListener('click', () => {
            alert(`🎉 Success! Your guided tour reservation request has been submitted for ${attraction.name}. Local guides will contact you shortly via email.`);
        });

        btnGroup.appendChild(directionsBtn);
        btnGroup.appendChild(tourBtn);

        // Assemble Top Grid (Image/Map in Left column, Info/Buttons in Right column)
        const topGrid = createEl('div', { className: 'detail-top-grid' });
        page.appendChild(topGrid);

        const gridLeft = createEl('div', { className: 'detail-grid-left' });
        const gridRight = createEl('div', { className: 'detail-grid-right' });
        topGrid.appendChild(gridLeft);
        topGrid.appendChild(gridRight);

        // Left Column elements
        gridLeft.appendChild(heroSection);
        gridLeft.appendChild(mapContainer);

        // Right Column elements
        gridRight.appendChild(detailHeader);
        gridRight.appendChild(statsGrid);
        gridRight.appendChild(descHeader);
        gridRight.appendChild(descParagraph);
        gridRight.appendChild(btnGroup);

        // 7. Nearby Attractions Shelf (spans full width at bottom)
        const nearbyHeader = createEl('div', { className: 'section-header', attributes: { style: 'margin-top: var(--spacing-lg);' } });
        nearbyHeader.innerHTML = `
            <div>
                <h3 class="section-title" style="font-size: var(--font-size-md);">Nearby Attractions</h3>
                <p class="section-subtitle">Discover more spots nearby</p>
            </div>
        `;
        page.appendChild(nearbyHeader);

        // Find closest attractions (distance sorting)
        const sortedAttractions = attractions
            .filter(a => a.id !== attraction.id)
            .map(a => {
                const distance = calculateDistance(attraction.lat, attraction.lng, a.lat, a.lng);
                return { attraction: a, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3)
            .map(item => item.attraction);

        const nearbyGrid = createEl('div', { className: 'card-grid' });
        sortedAttractions.forEach(attr => {
            nearbyGrid.appendChild(AttractionCard(attr, userLocation));
        });
        page.appendChild(nearbyGrid);

        // 8. Footer (spans full width)
        page.appendChild(Footer());

        // Leaflet Mini Map initialization hook
        setTimeout(() => {
            const mapEl = document.getElementById('detail-mini-map');
            if (mapEl) {
                mapInstance = L.map('detail-mini-map', {
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    dragging: false
                }).setView([attraction.lat, attraction.lng], 12);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19
                }).addTo(mapInstance);

                L.marker([attraction.lat, attraction.lng]).addTo(mapInstance);
            }
        }, 50);
    };

    render();
    
    // Refresh page if state updates (loading completed, etc.)
    state.subscribe((key) => {
        if (key === 'loading' || key === 'attractions' || key === 'userLocation') {
            render();
        }
    });

    return wrapper;
};
