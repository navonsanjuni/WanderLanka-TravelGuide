import { createEl } from '../utils/dom.js';

export const DistanceBadge = (distanceInKm) => {
    const badge = createEl('div', { className: 'distance-badge' });
    badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        ${distanceInKm} km
    `;
    return badge;
};
