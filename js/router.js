import { renderHomePage } from './pages/HomePage.js';
import { renderDetailPage } from './pages/DetailPage.js';
import { renderFavoritesPage } from './pages/FavoritesPage.js';
import { renderMapViewPage } from './pages/MapViewPage.js';
import { renderProfilePage } from './pages/ProfilePage.js';
import { renderSearchPage } from './pages/SearchPage.js';

const routes = {
    '/': renderHomePage,
    '/favorites': renderFavoritesPage,
    '/map': renderMapViewPage,
    '/profile': renderProfilePage,
    '/search': renderSearchPage,
    '/attraction': renderDetailPage // dynamic param handling
};

export const router = () => {
    // Parse the current hash
    let path = window.location.hash.slice(1) || '/';
    
    // Handle dynamic routes like /attraction/1
    const pathParts = path.split('/');
    let renderFunction;
    let param = null;

    if (pathParts[1] === 'attraction' && pathParts[2]) {
        renderFunction = routes['/attraction'];
        param = pathParts[2];
    } else {
        renderFunction = routes[path] || routes['/'];
    }

    // Get the root app element
    const appElement = document.getElementById('app');
    
    // Clear and render
    appElement.innerHTML = '';
    appElement.appendChild(renderFunction(param));
};

export const initRouter = () => {
    window.addEventListener('hashchange', router);
    router(); // Initial call
};

export const navigateTo = (path) => {
    window.location.hash = path;
};
