# WanderLanka - Local Tour & Travel Web Guide

## Framework
This project is built using **Vanilla JavaScript (ES6 Modules)**. It implements a custom Single Page Application (SPA) architecture utilizing a hash-based router (`#/`, `#/favorites`, `#/attraction/:id`), a centralized state manager, and a component-based structure to emulate modern JS frameworks like React/Vue without any dependencies.

## Browser Notes
- Fully supported in modern browsers (Chrome, Firefox, Safari, Edge).
- Tested specifically via DevTools responsive mode simulating iPhone and Android viewports.
- Uses modern features like `fetch()`, `async/await`, `CSS Variables`, and HTML5 Geolocation API. Ensure you are running it in a secure context (localhost or HTTPS) for Geolocation to work.

## Localhost Setup Instructions

1. **Clone the repository / Extract the folder.**
2. **Serve the directory:**
   Because this project uses ES6 Modules (`type="module"`) and `fetch()` to load `data/attractions.json`, it **cannot** be opened directly from the file system (`file:///`). You must use a local web server.

   **Using VS Code:**
   - Install the "Live Server" extension.
   - Right-click `index.html` and select "Open with Live Server".

   **Using Node.js (npx):**
   ```bash
   npx serve .
   ```
   
   **Using Python 3:**
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` (or the port provided by your server) in your browser.
4. Open Developer Tools (F12) and switch to the **Device Toolbar** to view the app in mobile mode.
