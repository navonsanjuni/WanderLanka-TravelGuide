import { createEl } from '../utils/dom.js';
import { FavoriteButton } from './FavoriteButton.js';
import { calculateDistance } from '../utils/distance.js';

export const AttractionCard = (attraction, userLocation) => {
    const card = createEl('a', { 
        className: 'card', 
        attributes: { href: `#/attraction/${attraction.id}` }
    });
    
    const imgWrapper = createEl('div', { className: 'card-img-wrapper' });
    imgWrapper.innerHTML = `<img src="${attraction.image}" alt="${attraction.name}" class="card-img" loading="lazy">`;
    
    // Add Distance Overlay Badge if location is available
    if (userLocation) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, attraction.lat, attraction.lng);
        if (dist !== null) {
            const distanceOverlay = createEl('div', { 
                className: 'card-distance-badge', 
                html: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg> ${dist} km`
            });
            imgWrapper.appendChild(distanceOverlay);
        }
    } else {
        // Fallback distance badge
        const distanceOverlay = createEl('div', { 
            className: 'card-distance-badge', 
            html: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg> Nearby`
        });
        imgWrapper.appendChild(distanceOverlay);
    }
    
    // Favorite Button
    const favBtn = FavoriteButton(attraction.id);
    favBtn.className = 'card-favorite-btn';
    // Prevent default so clicking favorite doesn't navigate to detail page
    favBtn.addEventListener('click', (e) => e.preventDefault());
    imgWrapper.appendChild(favBtn);
    
    const content = createEl('div', { className: 'card-content' });
    
    // Tags row
    const tagsWrapper = createEl('div', { className: 'card-tags' });
    const categoryClass = attraction.category ? `tag-${attraction.category.toLowerCase()}` : '';
    tagsWrapper.innerHTML = `
        <span class="tag ${categoryClass}">${attraction.category}</span>
        <span class="tag tag-status">Open Now</span>
    `;
    
    content.appendChild(tagsWrapper);
    
    // Title
    const titleEl = createEl('h3', { className: 'card-title', text: attraction.name });
    content.appendChild(titleEl);
    
    // Description snippet
    const descEl = createEl('p', { className: 'card-desc', text: attraction.description });
    content.appendChild(descEl);
    
    // Action Link
    const actionLink = createEl('span', { 
        className: 'card-action-link', 
        html: `View Details <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>` 
    });
    content.appendChild(actionLink);
    
    card.appendChild(imgWrapper);
    card.appendChild(content);
    
    return card;
};
