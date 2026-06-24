import { createEl } from '../utils/dom.js';

export const SearchBar = (onSearch) => {
    const container = createEl('div', { className: 'search-container' });
    
    const bar = createEl('div', { className: 'search-bar' });
    bar.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Search...">
    `;
    
    const input = bar.querySelector('input');
    
    input.addEventListener('input', (e) => {
        if (onSearch) onSearch(e.target.value);
    });
    
    container.appendChild(bar);
    return container;
};
