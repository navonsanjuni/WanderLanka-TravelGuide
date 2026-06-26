import { createEl } from '../utils/dom.js';
import { state } from '../state.js';
import { validators } from '../utils/validators.js';
import { Header } from '../components/Header.js';
import { BottomNav } from '../components/BottomNav.js';
import { Footer } from '../components/Footer.js';

export const renderProfilePage = () => {
    const wrapper = createEl('div');
    wrapper.appendChild(Header('Profile & Settings'));

    const page = createEl('div', { className: 'page-container' });
    wrapper.appendChild(page);

    const formContainer = createEl('div', { className: 'profile-form-container' });
    page.appendChild(formContainer);
    page.appendChild(Footer());

    wrapper.appendChild(BottomNav('/profile'));

    const profile = state.get('userProfile');

    formContainer.innerHTML = `
        <div id="form-feedback" class="form-feedback"></div>
        <form id="profile-form" novalidate>
            <div class="form-group">
                <label for="profile-name">Full Name</label>
                <input type="text" id="profile-name" class="form-input" value="${profile.name}" required>
                <div id="error-name" class="validation-error"></div>
            </div>

            <div class="form-group">
                <label for="profile-email">Email Address</label>
                <input type="email" id="profile-email" class="form-input" value="${profile.email}" required>
                <div id="error-email" class="validation-error"></div>
            </div>

            <div class="form-group">
                <label for="profile-style">Preferred Travel Style</label>
                <select id="profile-style" class="form-select">
                    <option value="Nature" ${profile.travelStyle === 'Nature' ? 'selected' : ''}>Nature & Outdoors</option>
                    <option value="Historical" ${profile.travelStyle === 'Historical' ? 'selected' : ''}>Historical & Culture</option>
                    <option value="Hotels" ${profile.travelStyle === 'Hotels' ? 'selected' : ''}>Luxury Hotels & Spas</option>
                </select>
            </div>

            <div class="form-group">
                <label for="profile-maps">Maps Deep-Link Integration</label>
                <select id="profile-maps" class="form-select">
                    <option value="gmaps" ${profile.mapsPref === 'gmaps' ? 'selected' : ''}>Google Maps Web (Universal)</option>
                    <option value="geo" ${profile.mapsPref === 'geo' ? 'selected' : ''}>Geo URI Scheme (Native Maps App)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="profile-theme">App Theme</label>
                <select id="profile-theme" class="form-select">
                    <option value="light" ${profile.theme === 'light' ? 'selected' : ''}>Light Theme</option>
                    <option value="dark" ${profile.theme === 'dark' ? 'selected' : ''}>Dark Theme</option>
                </select>
            </div>

            <div class="form-group">
                <label for="profile-loc-mode">Location Mode</label>
                <select id="profile-loc-mode" class="form-select">
                    <option value="simulated" ${profile.locationMode === 'simulated' ? 'selected' : ''}>Simulate Location (Custom Coordinates)</option>
                    <option value="browser" ${profile.locationMode === 'browser' ? 'selected' : ''}>Real Browser Geolocation (HTML5 API)</option>
                </select>
            </div>

            <div id="coordinates-group" style="display: ${profile.locationMode === 'simulated' ? 'block' : 'none'};">
                <div class="form-row-2">
                    <div class="form-group">
                        <label for="profile-lat">Simulated Latitude</label>
                        <input type="number" id="profile-lat" class="form-input" step="0.0001" value="${profile.simulatedLat}">
                        <div id="error-lat" class="validation-error"></div>
                    </div>
                    <div class="form-group">
                        <label for="profile-lng">Simulated Longitude</label>
                        <input type="number" id="profile-lng" class="form-input" step="0.0001" value="${profile.simulatedLng}">
                        <div id="error-lng" class="validation-error"></div>
                    </div>
                </div>
            </div>

            <button type="submit" class="submit-btn">Save Profile & Preferences</button>
        </form>
    `;

    // Hook up dynamic coordinates toggle
    const locModeSelect = formContainer.querySelector('#profile-loc-mode');
    const coordsGroup = formContainer.querySelector('#coordinates-group');
    locModeSelect.addEventListener('change', (e) => {
        coordsGroup.style.display = e.target.value === 'simulated' ? 'block' : 'none';
    });

    // Form submission & validation handler
    const form = formContainer.querySelector('#profile-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Elements
        const nameVal = form.querySelector('#profile-name').value;
        const emailVal = form.querySelector('#profile-email').value;
        const styleVal = form.querySelector('#profile-style').value;
        const mapsPrefVal = form.querySelector('#profile-maps').value;
        const themeVal = form.querySelector('#profile-theme').value;
        const locModeVal = locModeSelect.value;
        const latVal = form.querySelector('#profile-lat').value;
        const lngVal = form.querySelector('#profile-lng').value;

        // Reset errors
        form.querySelectorAll('.validation-error').forEach(div => div.textContent = '');
        const feedback = formContainer.querySelector('#form-feedback');
        feedback.className = 'form-feedback';
        feedback.textContent = '';

        let isValid = true;

        // Validate Name
        const nameErr = validators.isRequired(nameVal);
        if (nameErr) {
            form.querySelector('#error-name').textContent = nameErr;
            isValid = false;
        }

        // Validate Email
        const emailErr = validators.isRequired(emailVal) || validators.isEmail(emailVal);
        if (emailErr) {
            form.querySelector('#error-email').textContent = emailErr;
            isValid = false;
        }

        // Validate Coordinates if Simulated mode
        let finalLat = profile.simulatedLat;
        let finalLng = profile.simulatedLng;
        if (locModeVal === 'simulated') {
            const latErr = validators.isRequired(latVal);
            if (latErr) {
                form.querySelector('#error-lat').textContent = latErr;
                isValid = false;
            } else {
                const latNum = parseFloat(latVal);
                if (isNaN(latNum) || latNum < -90 || latNum > 90) {
                    form.querySelector('#error-lat').textContent = 'Must be between -90 and 90';
                    isValid = false;
                } else {
                    finalLat = latNum;
                }
            }

            const lngErr = validators.isRequired(lngVal);
            if (lngErr) {
                form.querySelector('#error-lng').textContent = lngErr;
                isValid = false;
            } else {
                const lngNum = parseFloat(lngVal);
                if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
                    form.querySelector('#error-lng').textContent = 'Must be between -180 and 180';
                    isValid = false;
                } else {
                    finalLng = lngNum;
                }
            }
        }

        if (!isValid) {
            feedback.textContent = 'Please correct the errors in the form before saving.';
            feedback.classList.add('error');
            return;
        }

        // Save preferences
        const updatedProfile = {
            name: nameVal,
            email: emailVal,
            travelStyle: styleVal,
            mapsPref: mapsPrefVal,
            theme: themeVal,
            locationMode: locModeVal,
            simulatedLat: finalLat,
            simulatedLng: finalLng
        };

        state.set('userProfile', updatedProfile);

        // Apply theme immediately
        if (themeVal === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // If browser geolocation mode is requested, trigger background update
        if (locModeVal === 'browser') {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    state.set('userLocation', { lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (err) => {
                    console.warn('Could not query browser geolocation', err);
                }
            );
        }

        // Show Success
        feedback.textContent = 'Settings saved successfully!';
        feedback.classList.add('success');
        
        // Scroll form to top to see success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return wrapper;
};
