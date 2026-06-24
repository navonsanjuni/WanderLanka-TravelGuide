import { createEl } from '../utils/dom.js';
import { AttractionCard } from './AttractionCard.js';

export const AttractionGrid = (attractions, userLocation) => {
    const grid = createEl('div', { className: 'attraction-grid' });
    
    if (!attractions || attractions.length === 0) {
        grid.innerHTML = '<p class="empty-state">No attractions found.</p>';
        return grid;
    }
    
    attractions.forEach(attr => {
        grid.appendChild(AttractionCard(attr, userLocation));
    });
    
    return grid;
};
