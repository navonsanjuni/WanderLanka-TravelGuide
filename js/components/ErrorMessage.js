import { createEl } from '../utils/dom.js';

export const ErrorMessage = (msg) => {
    return createEl('div', { 
        className: 'error-message',
        text: msg
    });
};
