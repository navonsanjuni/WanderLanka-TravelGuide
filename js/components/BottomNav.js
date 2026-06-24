import { createEl } from '../utils/dom.js';

export const BottomNav = (activeRoute = '/') => {
    const nav = createEl('nav', { className: 'bottom-nav' });
    
    const homeActive = activeRoute === '/' ? 'active' : '';
    const searchActive = activeRoute === '/search' ? 'active' : '';
    const favActive = activeRoute === '/favorites' ? 'active' : '';
    const mapActive = activeRoute === '/map' ? 'active' : '';
    
    nav.innerHTML = `
        <a href="#/" class="nav-item ${homeActive}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            <span>Explore</span>
        </a>
        <a href="#/search" class="nav-item ${searchActive}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Search</span>
        </a>
        <a href="#/favorites" class="nav-item ${favActive}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${favActive ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span>Favorites</span>
        </a>
        <a href="#/map" class="nav-item ${mapActive}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
            <span>Map</span>
        </a>
    `;
    
    return nav;
};
