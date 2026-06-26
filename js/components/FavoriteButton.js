import { createEl } from '../utils/dom.js';
import { storageService } from '../services/storageService.js';

export const FavoriteButton = (id, onToggle = null) => {
    const isFav = storageService.isFavorite(id);
    const btn = createEl('button', { 
        className: `fav-btn ${isFav ? 'active' : ''}`,
        attributes: { 'aria-label': 'Toggle Favorite' }
    });
    
    const renderIcon = (active) => {
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${active ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
    };
    
    renderIcon(isFav);
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const newStatus = storageService.toggleFavorite(id);
        if (newStatus) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        renderIcon(newStatus);
        
        if (onToggle) onToggle(newStatus);
    });
    
    return btn;
};
