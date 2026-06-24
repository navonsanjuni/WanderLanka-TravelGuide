// Helper to create DOM elements with classes and attributes
export const createEl = (tag, options = {}) => {
    const el = document.createElement(tag);
    
    if (options.className) el.className = options.className;
    if (options.id) el.id = options.id;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    
    if (options.attributes) {
        for (const [key, value] of Object.entries(options.attributes)) {
            el.setAttribute(key, value);
        }
    }
    
    if (options.events) {
        for (const [event, handler] of Object.entries(options.events)) {
            el.addEventListener(event, handler);
        }
    }
    
    return el;
};
