import { createEl } from '../utils/dom.js';

export const LoadingSpinner = () => {
    return createEl('div', { 
        className: 'loading-spinner',
        html: '<p>Loading attractions...</p>' // Could be an SVG spinner
    });
};
