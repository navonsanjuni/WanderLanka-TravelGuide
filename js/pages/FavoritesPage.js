import { createEl } from '../utils/dom.js';
import { state } from '../state.js';
import { Header } from '../components/Header.js';
import { BottomNav } from '../components/BottomNav.js';
import { AttractionCard } from '../components/AttractionCard.js';
import { storageService } from '../services/storageService.js';
import { Footer } from '../components/Footer.js';

export const renderFavoritesPage = () => {
    const wrapper = createEl('div');
    wrapper.appendChild(Header('Favorites'));

    const page = createEl('div', { className: 'page-container' });
    wrapper.appendChild(page);

    wrapper.appendChild(BottomNav('/favorites'));

    const render = () => {
        page.innerHTML = '';

        const attractions = state.get('attractions') || [];
        const userLocation = state.get('userLocation');
        const favIds = storageService.getFavorites();

        // 1. Title Block
        const titleBlock = createEl('div', { style: 'margin-bottom: var(--spacing-lg);' });
        titleBlock.innerHTML = `
            <h2 class="section-title">Your Saved Places</h2>
            <p class="section-subtitle">Revisit the destinations that caught your eye. Ready for your next adventure?</p>
        `;
        page.appendChild(titleBlock);

        // 2. Saved Attractions Grid
        const savedAttractions = attractions.filter(a => favIds.includes(a.id));
        const grid = createEl('div', { className: 'card-grid' });

        if (savedAttractions.length === 0) {
            grid.innerHTML = '<p class="empty-state">No saved places yet. Explore attractions and tap the bookmark ribbon to save them here!</p>';
            page.appendChild(grid);
        } else {
            savedAttractions.forEach(attr => {
                grid.appendChild(AttractionCard(attr, userLocation));
            });
            page.appendChild(grid);
        }

        // 3. Recommendation Section ("Based on your taste")
        const recSection = createEl('div', { className: 'recommendations-section' });
        
        // Find attractions not saved yet for recommendations
        const recommendedAttractions = attractions.filter(a => !favIds.includes(a.id)).slice(0, 3);
        
        if (recommendedAttractions.length > 0) {
            recSection.innerHTML = `
                <div class="section-header" style="margin-top: var(--spacing-lg);">
                    <div>
                        <h3 class="section-title" style="font-size: var(--font-size-lg);">Based on your taste</h3>
                        <p class="section-subtitle">We think you'll love these spots based on your preferences</p>
                    </div>
                </div>
            `;
            
            const recGrid = createEl('div', { className: 'card-grid' });
            recommendedAttractions.forEach(attr => {
                recGrid.appendChild(AttractionCard(attr, userLocation));
            });
            recSection.appendChild(recGrid);
            page.appendChild(recSection);
        }

        // 4. Footer
        page.appendChild(Footer());
    };

    render();
    
    // Subscribe to state changes (to automatically remove/add cards if favorite toggled)
    state.subscribe((key) => {
        if (key === 'attractions' || key === 'userLocation') {
            render();
        }
    });

    return wrapper;
};
