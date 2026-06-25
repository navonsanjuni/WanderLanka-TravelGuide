import { createEl } from '../utils/dom.js';
import { state } from '../state.js';
import { navigateTo } from '../router.js';

export const Footer = () => {
    const footer = createEl('footer', { className: 'app-footer' });
    
    footer.innerHTML = `
        <div class="footer-top">
            <div class="footer-brand">
                <span class="footer-brand-title">Nuwara Explorer</span>
                <p class="footer-desc">Explore the beauty of the world. Your premium travel guide to hidden paths and curated maps.</p>
            </div>
            <div class="footer-links">
                <div class="footer-link-col">
                    <h4>Explore</h4>
                    <a href="#/" class="footer-link">Home</a>
                    <a href="#/favorites" class="footer-link">Favorites</a>
                </div>
                <div class="footer-link-col">
                    <h4>Categories</h4>
                    <button class="footer-link footer-cat-btn" data-category="Nature">Nature</button>
                    <button class="footer-link footer-cat-btn" data-category="Historical">Historical</button>
                    <button class="footer-link footer-cat-btn" data-category="Hotels">Hotels</button>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Nuwara Explorer. All rights reserved.</p>
            <div class="footer-bottom-links">
                <a href="#/profile" class="footer-bottom-link">Privacy</a>
                <a href="#/profile" class="footer-bottom-link">Terms</a>
                <a href="#/profile" class="footer-bottom-link">Support</a>
            </div>
        </div>
    `;

    // Set up click handlers for categories
    footer.querySelectorAll('.footer-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            state.set('activeCategory', category);
            navigateTo('/');
            // Scroll to top to see filtered results
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    return footer;
};
