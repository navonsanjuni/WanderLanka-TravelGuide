import { createEl } from '../utils/dom.js';

export const CategoryFilter = (activeCategory, onSelect) => {
    const container = createEl('div', { className: 'category-filter' });
    
    const categories = ['All', 'Nature', 'Historical', 'Hotels'];
    
    categories.forEach(cat => {
        const btn = createEl('button', { 
            className: `filter-chip ${activeCategory === cat ? 'active' : ''}`,
            text: cat
        });
        
        btn.addEventListener('click', () => {
            if (onSelect) onSelect(cat);
        });
        
        container.appendChild(btn);
    });
    
    return container;
};
