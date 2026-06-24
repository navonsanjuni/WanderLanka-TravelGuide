import { createEl } from '../utils/dom.js';
import { state } from '../state.js';

export const Header = (title = 'Explore') => {
    const header = createEl('header', { className: 'app-header' });
    const profile = state.get('userProfile') || { name: 'Traveler' };
    
    // Calculate initials
    const nameParts = profile.name.trim().split(/\s+/);
    let initials = 'T';
    if (nameParts.length > 0 && nameParts[0]) {
        initials = nameParts[0].charAt(0).toUpperCase();
        if (nameParts.length > 1 && nameParts[nameParts.length - 1]) {
            initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
        }
    }
    
    header.innerHTML = `
        <div class="header-logo-section">
            <a href="#/" class="header-brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="brand-icon"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                <span>WanderLanka</span>
            </a>
        </div>
        
        <div class="header-nav-desktop">
            <a href="#/" class="header-nav-link ${title === 'Explore' ? 'active' : ''}">Explore</a>
            <a href="#/map" class="header-nav-link ${title === 'Map' ? 'active' : ''}">Map</a>
            <a href="#/favorites" class="header-nav-link ${title === 'Favorites' ? 'active' : ''}">Favorites</a>
            <a href="#/profile" class="header-nav-link ${title === 'Profile' ? 'active' : ''}">Settings</a>
        </div>

        <div class="header-actions">
            <a href="#/profile" class="header-avatar" title="View Profile">
                ${initials}
            </a>
        </div>
    `;
    
    return header;
};
