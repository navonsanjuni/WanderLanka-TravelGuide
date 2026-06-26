import { createEl } from '../utils/dom.js';
import { state } from '../state.js';
import { Header } from '../components/Header.js';
import { BottomNav } from '../components/BottomNav.js';
import { AttractionCard } from '../components/AttractionCard.js';
import { CategoryFilter } from '../components/CategoryFilter.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorMessage } from '../components/ErrorMessage.js';
import { Footer } from '../components/Footer.js';

export const renderHomePage = () => {
    const wrapper = createEl('div');
    
    // Header
    wrapper.appendChild(Header('Explore'));

    const page = createEl('div', { className: 'page-container' });
    wrapper.appendChild(page);
    
    // Bottom Nav
    wrapper.appendChild(BottomNav('/'));

    const render = () => {
        page.innerHTML = '';
        
        const isLoading = state.get('loading');
        const error = state.get('error');
        const attractions = state.get('attractions');
        const userLocation = state.get('userLocation');
        const activeCategory = state.get('activeCategory') || 'All';
        
        if (isLoading) {
            page.appendChild(LoadingSpinner());
            return;
        }
        
        if (error) {
            page.appendChild(ErrorMessage(error));
            return;
        }

        // 1. Hero Section
        const hero = createEl('div', { className: 'hero-container' });
        hero.innerHTML = `
            <div class="hero-content">
                <h1 class="hero-title">Explore Misty<br>Nuwara Eliya.</h1>
                <p class="hero-desc">Experience the breathtaking tea gardens, historic colonial estates, and roaring waterfalls with curated local maps, real-time distance tracking, and offline navigation.</p>
                <div class="hero-actions">
                    <a href="#/map" class="btn-primary">Start Exploring</a>
                    <a href="#/profile" class="btn-secondary">Set Location</a>
                </div>
            </div>
        `;
        page.appendChild(hero);

        // 2. Section Header
        const sectionHeader = createEl('div', { className: 'section-header' });
        sectionHeader.innerHTML = `
            <div>
                <h2 class="section-title">Local Attractions</h2>
                <p class="section-subtitle">Recommended spots near your current location</p>
            </div>
            <a href="#/map" class="section-link">View all &rarr;</a>
        `;
        page.appendChild(sectionHeader);

        // 3. Category Filter
        page.appendChild(CategoryFilter(activeCategory, (cat) => {
            state.set('activeCategory', cat);
        }));
        
        // Filter Data by Category
        let filtered = attractions || [];
        if (activeCategory !== 'All') {
            filtered = filtered.filter(a => a.category === activeCategory);
        }
            
        // 4. Render Grid of Cards
        const grid = createEl('div', { className: 'card-grid' });
        if (filtered.length === 0) {
            grid.innerHTML = '<p class="empty-state">No attractions found in this category.</p>';
        } else {
            filtered.forEach(attr => {
                grid.appendChild(AttractionCard(attr, userLocation));
            });
        }
        page.appendChild(grid);

        // 5. Interactive Trail Mapping Promo Banner
        const promo = createEl('div', { className: 'trail-mapping-banner' });
        promo.innerHTML = `
            <div class="banner-left">
                <h3 class="banner-title">Interactive Trail Mapping</h3>
                <p class="banner-desc">Download offline maps and track your progress in real-time with our enhanced Explorer tools.</p>
                <a href="#/map" class="banner-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon></svg>
                    Launch Explorer Map
                </a>
            </div>
            <div class="banner-right"></div>
        `;
        page.appendChild(promo);

        // 6. Footer
        page.appendChild(Footer());
    };

    render();
    const unsubscribe = state.subscribe((key) => {
        if (key === 'loading' || key === 'error' || key === 'attractions' || key === 'userLocation' || key === 'activeCategory') {
            render();
        }
    });
    
    return wrapper;
};
