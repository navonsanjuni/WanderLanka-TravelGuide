import { createEl } from '../utils/dom.js';
import { state } from '../state.js';
import { Header } from '../components/Header.js';
import { BottomNav } from '../components/BottomNav.js';
import { AttractionCard } from '../components/AttractionCard.js';
import { CategoryFilter } from '../components/CategoryFilter.js';
import { Footer } from '../components/Footer.js';

export const renderSearchPage = () => {
    const wrapper = createEl('div');
    wrapper.appendChild(Header('Explore')); // Keeps branding consistent

    const page = createEl('div', { className: 'page-container' });
    wrapper.appendChild(page);

    wrapper.appendChild(BottomNav('/search'));

    let searchQuery = '';
    let selectedCategory = 'All';

    const render = () => {
        page.innerHTML = '';

        // Title
        const titleEl = createEl('div', { style: 'margin-bottom: var(--spacing-lg);' });
        titleEl.innerHTML = `
            <h2 class="section-title">Search Destinations</h2>
            <p class="section-subtitle">Find your next adventure in Sri Lanka</p>
        `;
        page.appendChild(titleEl);

        // Search Input Box
        const searchBox = createEl('div', { 
            className: 'search-bar', 
            attributes: { style: 'margin-bottom: var(--spacing-md);' }
        });
        searchBox.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="search-page-input" placeholder="Try 'Sigiriya', 'Nature', 'Waterfall'..." value="${searchQuery}">
        `;
        page.appendChild(searchBox);

        // Category Filter
        page.appendChild(CategoryFilter(selectedCategory, (cat) => {
            selectedCategory = cat;
            renderResults();
        }));

        // Results Container
        const resultsWrapper = createEl('div');
        page.appendChild(resultsWrapper);

        const renderResults = () => {
            resultsWrapper.innerHTML = '';
            
            const attractions = state.get('attractions') || [];
            const userLocation = state.get('userLocation');

            // Filter logic
            let filtered = attractions;
            if (selectedCategory !== 'All') {
                filtered = filtered.filter(a => a.category === selectedCategory);
            }
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(a => 
                    a.name.toLowerCase().includes(query) || 
                    a.category.toLowerCase().includes(query) || 
                    a.description.toLowerCase().includes(query)
                );
            }

            // Render Grid
            const grid = createEl('div', { className: 'card-grid' });
            if (filtered.length === 0) {
                grid.innerHTML = '<p class="empty-state">No matching destinations found. Try another search term!</p>';
            } else {
                filtered.forEach(attr => {
                    grid.appendChild(AttractionCard(attr, userLocation));
                });
            }
            resultsWrapper.appendChild(grid);
        };

        renderResults();

        // Focus search input
        const input = searchBox.querySelector('#search-page-input');
        input.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderResults();
        });

        // Add Footer
        page.appendChild(Footer());
    };

    render();
    return wrapper;
};
