import { createEl } from '../utils/dom.js';
import { state } from '../state.js';

export const Header = (title = 'Explore') => {
    const header = createEl('header', { className: 'app-header' });
    const profile = state.get('userProfile') || { name: 'Traveler' };
    
    // Initials calculation removed since we are using an icon now
    header.innerHTML = `
        <div class="header-logo-section">
            <a href="#/" class="header-brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="brand-icon"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                <span>Nuwara Explorer</span>
            </a>
        </div>
        
        <div class="header-actions">
            <a href="#/profile" class="header-avatar" title="Settings / Profile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </a>
        </div>
    `;
    
    return header;
};
