// Global state
let allPlanets = [];
let filteredPlanets = [];
let selectedPlanet = null;
let animationFrame = null;
let currentView = 'planet';
let canvas, ctx, angle = 0;

// Initialize stars background
function createStars() {
    const container = document.getElementById('starsContainer');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
    }
}

// Load embedded data
function loadEmbeddedData() {
    if (typeof EMBEDDED_DATA !== 'undefined') {
        allPlanets = EMBEDDED_DATA;
        filteredPlanets = allPlanets;
        updateUI();
        populateFilters();
        displayPlanets();
    }
}

// Update UI status
function updateUI() {
    document.getElementById('totalPlanets').textContent = allPlanets.length.toLocaleString();
    document.getElementById('filteredPlanets').textContent = filteredPlanets.length.toLocaleString();
    document.getElementById('selectedPlanet').textContent = selectedPlanet ? selectedPlanet['Planet Name'] : 'None';
    
    if (selectedPlanet) {
        const classification = classifyPlanetType(selectedPlanet);
        document.getElementById('classification').textContent = classification;
    } else {
        document.getElementById('classification').textContent = '-';
    }
}

// Populate filter dropdowns
function populateFilters() {
    const methods = [...new Set(allPlanets.map(p => p['Discovery Method']))].filter(Boolean).sort();
    const methodFilter = document.getElementById('methodFilter');
    methodFilter.innerHTML = '<option value="">All Methods</option>';
    methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = method;
        methodFilter.appendChild(option);
    });
}

// Autocomplete functionality
const searchBox = document.getElementById('searchBox');
const autocompleteDropdown = document.getElementById('autocompleteDropdown');
let autocompleteTimeout;

searchBox.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    clearTimeout(autocompleteTimeout);
    
    if (query.length < 2) {
        autocompleteDropdown.classList.remove('show');
        applyFilters();
        return;
    }

    autocompleteTimeout = setTimeout(() => {
        const matches = allPlanets.filter(planet => 
            (planet['Planet Name'] || '').toLowerCase().includes(query)
        ).slice(0, 10);

        if (matches.length > 0) {
            autocompleteDropdown.innerHTML = matches.map(planet => {
                const mass = parseFloat(planet['Mass']) || 0;
                const massEarth = (mass / 317.8).toFixed(1);
                const distance = parseFloat(planet['Distance']) || 0;
                const distanceLY = (distance * 3.26).toFixed(1);
                
                return `
                    <div class="autocomplete-item" onclick="selectPlanetFromAutocomplete('${planet['Planet Name'].replace(/'/g, "\\'")}')">
                        <div class="autocomplete-planet-name">${planet['Planet Name']}</div>
                        <div class="autocomplete-info">
                            ${planet['Planet Host'] || 'Unknown'} • 
                            ${distanceLY > 0 ? distanceLY + ' ly' : 'Unknown'} • 
                            ${massEarth > 0 ? massEarth + ' M⊕' : 'Unknown'}
                        </div>
                    </div>
                `;
            }).join('');
            autocompleteDropdown.classList.add('show');
        } else {
            autocompleteDropdown.classList.remove('show');
        }
        applyFilters();
    }, 200);
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        autocompleteDropdown.classList.remove('show');
    }
});

function selectPlanetFromAutocomplete(planetName) {
    const planet = allPlanets.find(p => p['Planet Name'] === planetName);
    if (planet) {
        selectPlanet(planet);
        searchBox.value = planetName;
        autocompleteDropdown.classList.remove('show');
        applyFilters();
    }
}

// Apply filters
function applyFilters() {
    const searchTerm = searchBox.value.toLowerCase();
    const method = document.getElementById('methodFilter').value;
    const yearMin = parseInt(document.getElementById('yearMin').value) || 0;
    const yearMax = parseInt(document.getElementById('yearMax').value) || 3000;
    const distanceMax = parseFloat(document.getElementById('distanceMax').value) || Infinity;
    const massMin = parseFloat(document.getElementById('massMin').value) || 0;
    const massMax = parseFloat(document.getElementById('massMax').value) || Infinity;

    filteredPlanets = allPlanets.filter(planet => {
        const name = (planet['Planet Name'] || '').toLowerCase();
        const planetMethod = planet['Discovery Method'] || '';
        const year = parseInt(planet['Discovery Year']) || 0;
        const distance = parseFloat(planet['Distance']) || 0;
        const mass = parseFloat(planet['Mass']) || 0;

        return name.includes(searchTerm) &&
               (!method || planetMethod === method) &&
               year >= yearMin && year <= yearMax &&
               distance * 3.26 <= distanceMax &&
               mass >= massMin && mass <= massMax;
    });

    displayPlanets();
    updateUI();
}

// Reset filters
function resetFilters() {
    searchBox.value = '';
    document.getElementById('methodFilter').value = '';
    document.getElementById('yearMin').value = '';
    document.getElementById('yearMax').value = '';
    document.getElementById('distanceMax').value = '';
    document.getElementById('massMin').value = '';
    document.getElementById('massMax').value = '';
    autocompleteDropdown.classList.remove('show');
    filteredPlanets = allPlanets;
    displayPlanets();
    updateUI();
}

// Display planets list
function displayPlanets() {
    const listContainer = document.getElementById('planetList');
    listContainer.innerHTML = '';

    if (allPlanets.length === 0) {
        listContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #a0aec0;">Loading...</div>';
        return;
    }

    filteredPlanets.slice(0, 50).forEach(planet => {
        const div = document.createElement('div');
        div.className = 'planet-item';
        if (selectedPlanet && selectedPlanet['Planet Name'] === planet['Planet Name']) {
            div.classList.add('selected');
        }
        
        const mass = parseFloat(planet['Mass']) || 0;
        const massEarth = mass / 317.8;
        const distance = parseFloat(planet['Distance']) || 0;
        const distanceLY = distance * 3.26;
        
        div.innerHTML = `
            <div class="planet-name">${planet['Planet Name']}</div>
            <div class="planet-info">
                ${planet['Planet Host'] || 'Unknown'} • 
                ${planet['Discovery Method'] || 'Unknown'}<br>
                ${distanceLY > 0 ? distanceLY.toFixed(2) + ' ly' : 'Unknown'} • 
                ${massEarth > 0 ? massEarth.toFixed(1) + ' M⊕' : 'Unknown'}
            </div>
        `;
        
        div.onclick = () => selectPlanet(planet);
        listContainer.appendChild(div);
    });

    if (filteredPlanets.length > 50) {
        const more = document.createElement('div');
        more.className = 'planet-info';
        more.style.textAlign = 'center';
        more.style.padding = '10px';
        more.textContent = `+ ${filteredPlanets.length - 50} more planets`;
        listContainer.appendChild(more);
    }

    if (filteredPlanets.length === 0) {
        listContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #a0aec0;">No matches</div>';
    }
}

// Select a planet and display details
function selectPlanet(planet) {
    selectedPlanet = planet;
    displayPlanets();
    updateUI();
    displayPlanetDetails(planet);
    currentView = 'planet';
}

// Display detailed planet information with simulation
function displayPlanetDetails(planet) {
    const detailsContainer = document.getElementById('planetDetails');
    
    const mass = parseFloat(planet['Mass']) || 0;
    const massEarth = (mass / 317.8).toFixed(2);
    const distance = parseFloat(planet['Distance']) || 0;
    const distanceLY = (distance * 3.26).toFixed(2);
    const orbitalPeriod = parseFloat(planet['Orbital Period Days']) || 0;
    const semiMajorAxis = parseFloat(planet['Orbit Semi-Major Axis']) || 0;
    const eccentricity = parseFloat(planet['Eccentricity']) || 0;
    const eqTemp = parseFloat(planet['Equilibrium Temperature']) || 0;
    const stellarTemp = parseFloat(planet['Stellar Effective Temperature']) || 0;
    const stellarRadius = parseFloat(planet['Stellar Radius']) || 0;
    const stellarMass = parseFloat(planet['Stellar Mass']) || 0;
    
    detailsContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #667eea; font-size: 2em; margin-bottom: 5px;">${planet['Planet Name']}</h2>
            <div style="color: #a0aec0; font-size: 1.1em;">Orbiting ${planet['Planet Host'] || 'Unknown Star'}</div>
            <div class="badge badge-success" style="margin-top: 10px;">
                ${planet['Discovery Year'] || 'Unknown'} • ${planet['Discovery Method'] || 'Unknown'}
            </div>
        </div>

        <div class="simulation-container">
            <div class="simulation-title">Planet Visualization</div>
            <canvas id="planetCanvas"></canvas>
            <div class="sim-controls">
                <button class="sim-button active" onclick="setView('planet')">Planet View</button>
                <button class="sim-button" onclick="setView('orbit')">Orbital View</button>
                <button class="sim-button" onclick="setView('comparison')">Size Compare</button>
            </div>
        </div>

        <div class="details-grid">
            <div class="detail-card">
                <h3>🪐 Planetary Properties</h3>
                <div class="detail-row">
                    <span class="detail-label">Mass</span>
                    <span class="detail-value">${massEarth > 0 ? massEarth + ' M⊕' : 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Distance from Earth</span>
                    <span class="detail-value">${distanceLY > 0 ? distanceLY + ' ly' : 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Equilibrium Temp</span>
                    <span class="detail-value">${eqTemp > 0 ? eqTemp + ' K' : 'Unknown'}</span>
                </div>
            </div>

            <div class="detail-card">
                <h3>🛸 Orbital Parameters</h3>
                <div class="detail-row">
                    <span class="detail-label">Orbital Period</span>
                    <span class="detail-value">${orbitalPeriod > 0 ? orbitalPeriod.toFixed(2) + ' days' : 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Semi-Major Axis</span>
                    <span class="detail-value">${semiMajorAxis > 0 ? semiMajorAxis + ' AU' : 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Eccentricity</span>
                    <span class="detail-value">${eccentricity >= 0 ? eccentricity.toFixed(3) : 'Unknown'}</span>
                </div>
            </div>

            <div class="detail-card">
                <h3>⭐ Host Star Properties</h3>
                <div class="detail-row">
                    <span class="detail-label">Spectral Type</span>
                    <span class="detail-value">${planet['Spectral Type'] || 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Effective Temp</span>
                    <span class="detail-value">${stellarTemp > 0 ? stellarTemp + ' K' : 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Stellar Mass</span>
                    <span class="detail-value">${stellarMass > 0 ? stellarMass + ' M☉' : 'Unknown'}</span>
                </div>
            </div>

            <div class="detail-card">
                <h3>🔭 Discovery Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Year</span>
                    <span class="detail-value">${planet['Discovery Year'] || 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Method</span>
                    <span class="detail-value">${planet['Discovery Method'] || 'Unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Facility</span>
                    <span class="detail-value">${planet['Discovery Facility'] || 'Unknown'}</span>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => initPlanetSimulation(), 100);
}

// Planet Simulation using Canvas
function initPlanetSimulation() {
    canvas = document.getElementById('planetCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animate();
}

function setView(view) {
    currentView = view;
    document.querySelectorAll('.sim-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function animate() {
    if (!canvas || !selectedPlanet) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentView === 'planet') {
        drawPlanetView();
    } else if (currentView === 'orbit') {
        drawOrbitView();
    } else if (currentView === 'comparison') {
        drawComparisonView();
    }
    
    angle += 0.01;
    animationFrame = requestAnimationFrame(animate);
}

function drawPlanetView() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const temp = parseFloat(selectedPlanet['Equilibrium Temperature']) || 300;
    const planetColor = getPlanetColor(temp);
    const mass = parseFloat(selectedPlanet['Mass']) || 0.003;
    const radius = Math.min(80, Math.max(20, Math.sqrt(mass * 317.8) * 5));
    
    // Draw planet with gradient
    const gradient = ctx.createRadialGradient(
        centerX - radius/3, centerY - radius/3, radius/10,
        centerX, centerY, radius
    );
    gradient.addColorStop(0, planetColor.light);
    gradient.addColorStop(1, planetColor.dark);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add atmosphere glow if potentially habitable
    if (temp > 200 && temp < 350) {
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Planet info text
    ctx.fillStyle = '#e0e6f0';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(selectedPlanet['Planet Name'], centerX, canvas.height - 20);
    
    const classification = classifyPlanetType(selectedPlanet);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#a0aec0';
    ctx.fillText(classification, centerX, canvas.height - 5);
}

function drawOrbitView() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const semiMajorAxis = parseFloat(selectedPlanet['Orbit Semi-Major Axis']) || 1;
    const eccentricity = parseFloat(selectedPlanet['Eccentricity']) || 0;
    
    const scale = Math.min(100, 120 / semiMajorAxis);
    const a = semiMajorAxis * scale;
    const b = a * Math.sqrt(1 - eccentricity * eccentricity);
    const c = a * eccentricity;
    
    // Draw star
    const starRadius = 15;
    const starGradient = ctx.createRadialGradient(
        centerX - c, centerY, 0,
        centerX - c, centerY, starRadius
    );
    starGradient.addColorStop(0, '#FFF9E6');
    starGradient.addColorStop(0.5, '#FFE55C');
    starGradient.addColorStop(1, '#FFA500');
    
    ctx.fillStyle = starGradient;
    ctx.beginPath();
    ctx.arc(centerX - c, centerY, starRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw orbit path
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw planet on orbit
    const planetX = centerX + a * Math.cos(angle);
    const planetY = centerY + b * Math.sin(angle);
    const planetRadius = 8;
    
    const temp = parseFloat(selectedPlanet['Equilibrium Temperature']) || 300;
    ctx.fillStyle = getPlanetColor(temp).dark;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw habitable zone
    const stellarMass = parseFloat(selectedPlanet['Stellar Mass']) || 1;
    const luminosity = Math.pow(stellarMass, 3.5);
    const hzInner = Math.sqrt(luminosity / 1.1) * scale;
    const hzOuter = Math.sqrt(luminosity / 0.53) * scale;
    
    ctx.fillStyle = 'rgba(52, 211, 153, 0.1)';
    ctx.beginPath();
    ctx.arc(centerX - c, centerY, hzOuter, 0, Math.PI * 2);
    ctx.arc(centerX - c, centerY, hzInner, 0, Math.PI * 2, true);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#34d399';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Habitable Zone', centerX - c, canvas.height - 10);
}

function drawComparisonView() {
    const mass = parseFloat(selectedPlanet['Mass']) || 0.003;
    const massEarth = mass / 317.8;
    const planetRadius = Math.min(60, Math.max(15, Math.sqrt(massEarth) * 30));
    const earthRadius = 30;
    
    const planetX = canvas.width * 0.35;
    const earthX = canvas.width * 0.65;
    const y = canvas.height / 2;
    
    // Draw selected planet
    const temp = parseFloat(selectedPlanet['Equilibrium Temperature']) || 300;
    const planetColor = getPlanetColor(temp);
    const planetGradient = ctx.createRadialGradient(
        planetX - planetRadius/3, y - planetRadius/3, planetRadius/10,
        planetX, y, planetRadius
    );
    planetGradient.addColorStop(0, planetColor.light);
    planetGradient.addColorStop(1, planetColor.dark);
    
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(planetX, y, planetRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Earth
    const earthGradient = ctx.createRadialGradient(
        earthX - earthRadius/3, y - earthRadius/3, earthRadius/10,
        earthX, y, earthRadius
    );
    earthGradient.addColorStop(0, '#7EC8E3');
    earthGradient.addColorStop(1, '#1E3A8A');
    
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, y, earthRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#e0e6f0';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    
    ctx.fillText(selectedPlanet['Planet Name'], planetX, canvas.height - 35);
    ctx.fillText('Earth', earthX, canvas.height - 35);
    
    ctx.font = '11px Arial';
    ctx.fillStyle = '#a0aec0';
    ctx.fillText(massEarth.toFixed(2) + ' M⊕', planetX, canvas.height - 20);
    ctx.fillText('1.00 M⊕', earthX, canvas.height - 20);
    
    const classification = classifyPlanetType(selectedPlanet);
    ctx.fillText(classification, planetX, canvas.height - 5);
    ctx.fillText('Rocky Planet', earthX, canvas.height - 5);
}

function getPlanetColor(temp) {
    if (temp < 100) return { light: '#B8C5D6', dark: '#4A5568' };
    if (temp < 200) return { light: '#93C5FD', dark: '#1E40AF' };
    if (temp < 300) return { light: '#7EC8E3', dark: '#1E3A8A' };
    if (temp < 400) return { light: '#FCD34D', dark: '#D97706' };
    if (temp < 600) return { light: '#FCA5A5', dark: '#DC2626' };
    return { light: '#FEF3C7', dark: '#EF4444' };
}

function classifyPlanetType(planet) {
    const mass = parseFloat(planet['Mass']) || 0;
    const massEarth = mass / 317.8;
    
    if (massEarth < 0.1) return 'Dwarf';
    if (massEarth < 2) return 'Rocky';
    if (massEarth < 10) return 'Super-Earth';
    if (massEarth < 50) return 'Neptune-like';
    if (massEarth < 500) return 'Gas Giant';
    return 'Super-Jupiter';
}

// SMART ANALYSIS FUNCTIONS

function analyzeHabitability() {
    if (!selectedPlanet) {
        showAnalysisResult('<p style="text-align: center; padding: 40px;">Please select a planet first</p>');
        return;
    }
    
    const semiMajorAxis = parseFloat(selectedPlanet['Orbit Semi-Major Axis']) || 0;
    const stellarMass = parseFloat(selectedPlanet['Stellar Mass']) || 1;
    const stellarTemp = parseFloat(selectedPlanet['Stellar Effective Temperature']) || 5778;
    const eqTemp = parseFloat(selectedPlanet['Equilibrium Temperature']) || 0;
    const mass = parseFloat(selectedPlanet['Mass']) || 0;
    const massEarth = mass / 317.8;
    const eccentricity = parseFloat(selectedPlanet['Eccentricity']) || 0;
    
    // Calculate habitable zone
    const luminosity = Math.pow(stellarMass, 3.5);
    const hzInner = Math.sqrt(luminosity / 1.1);
    const hzOuter = Math.sqrt(luminosity / 0.53);
    const inHZ = semiMajorAxis >= hzInner && semiMajorAxis <= hzOuter;
    
    // Habitability score
    let score = 0;
    let reasons = [];
    
    if (inHZ) {
        score += 35;
        reasons.push('✓ Orbits within habitable zone');
    } else {
        reasons.push('✗ Outside habitable zone');
    }
    
    if (eqTemp > 273 && eqTemp < 373) {
        score += 25;
        reasons.push('✓ Temperature allows liquid water');
    } else if (eqTemp > 200 && eqTemp < 400) {
        score += 15;
        reasons.push('~ Temperature possibly suitable');
    } else {
        reasons.push('✗ Temperature extreme');
    }
    
    if (massEarth >= 0.3 && massEarth <= 10) {
        score += 20;
        reasons.push('✓ Mass suitable for rocky planet');
    } else if (massEarth > 10 && massEarth < 50) {
        score += 5;
        reasons.push('~ Large planet, might be Neptune-like');
    } else {
        reasons.push('✗ Mass not ideal for habitability');
    }
    
    if (stellarTemp > 3500 && stellarTemp < 7000) {
        score += 15;
        reasons.push('✓ Star type suitable for life');
    } else {
        score += 5;
        reasons.push('~ Star type less ideal');
    }
    
    if (eccentricity < 0.2) {
        score += 5;
        reasons.push('✓ Low orbital eccentricity');
    } else {
        reasons.push('~ High eccentricity causes temperature variations');
    }
    
    let verdict, verdictClass;
    if (score >= 70) {
        verdict = 'HIGHLY PROMISING FOR HABITABILITY';
        verdictClass = 'badge-success';
    } else if (score >= 40) {
        verdict = 'POTENTIALLY HABITABLE';
        verdictClass = 'badge-warning';
    } else if (score >= 20) {
        verdict = 'MARGINALLY HABITABLE';
        verdictClass = 'badge-warning';
    } else {
        verdict = 'UNLIKELY TO BE HABITABLE';
        verdictClass = 'badge-danger';
    }
    
    const result = `
        <h3>🌍 Habitability Analysis</h3>
        <div class="analysis-section">
            <div class="badge ${verdictClass}" style="font-size: 1em; padding: 8px 16px;">
                ${verdict} (Score: ${score}/100)
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Habitable Zone Calculation</h4>
            <div class="analysis-item">Inner Edge: ${hzInner.toFixed(3)} AU</div>
            <div class="analysis-item">Outer Edge: ${hzOuter.toFixed(3)} AU</div>
            <div class="analysis-item">Planet Distance: ${semiMajorAxis.toFixed(3)} AU</div>
            <div class="analysis-item">
                <span class="badge ${inHZ ? 'badge-success' : 'badge-danger'}">
                    ${inHZ ? 'INSIDE HABITABLE ZONE' : 'OUTSIDE HABITABLE ZONE'}
                </span>
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Key Factors</h4>
            ${reasons.map(r => `<div class="analysis-item">${r}</div>`).join('')}
        </div>
        
        <div class="analysis-section">
            <h4>Temperature Analysis</h4>
            <div class="analysis-item">Equilibrium Temperature: ${eqTemp > 0 ? eqTemp + ' K (' + (eqTemp - 273).toFixed(0) + '°C)' : 'Unknown'}</div>
            <div class="analysis-item">Earth's Avg: 288 K (15°C)</div>
            <div class="analysis-item">Water Range: 273-373 K (0-100°C)</div>
        </div>
    `;
    
    showAnalysisResult(result);
}

function classifyPlanet() {
    if (!selectedPlanet) {
        showAnalysisResult('<p style="text-align: center; padding: 40px;">Please select a planet first</p>');
        return;
    }
    
    const mass = parseFloat(selectedPlanet['Mass']) || 0;
    const massEarth = mass / 317.8;
    const eqTemp = parseFloat(selectedPlanet['Equilibrium Temperature']) || 0;
    
    let type, description, examples, color;
    
    if (massEarth < 0.1) {
        type = 'Dwarf Planet / Large Moon';
        description = 'Very small body, likely rocky with minimal atmosphere';
        examples = 'Similar to: Pluto, Moon';
        color = 'badge-info';
    } else if (massEarth < 2) {
        type = 'Rocky / Terrestrial Planet';
        description = 'Earth-sized rocky planet with possible thin atmosphere';
        examples = 'Similar to: Earth, Mars, Venus';
        color = 'badge-success';
    } else if (massEarth < 10) {
        type = 'Super-Earth';
        description = 'Larger rocky planet or small gas planet';
        examples = 'Similar to: Kepler-452b';
        color = 'badge-success';
    } else if (massEarth < 50) {
        type = 'Neptune-like / Ice Giant';
        description = 'Planet with substantial hydrogen/helium atmosphere';
        examples = 'Similar to: Neptune, Uranus';
        color = 'badge-warning';
    } else if (massEarth < 500) {
        type = 'Gas Giant (Jupiter-class)';
        description = 'Massive planet primarily composed of hydrogen and helium';
        examples = 'Similar to: Jupiter, Saturn';
        color = 'badge-warning';
    } else {
        type = 'Super-Jupiter';
        description = 'Extremely massive gas giant, approaching brown dwarf territory';
        examples = 'Larger than: Jupiter';
        color = 'badge-danger';
    }
    
    let tempClass, tempDesc;
    if (eqTemp < 150) {
        tempClass = 'Frozen World';
        tempDesc = 'Extremely cold, likely covered in ice';
    } else if (eqTemp < 273) {
        tempClass = 'Cold World';
        tempDesc = 'Below freezing, ice and frozen gases';
    } else if (eqTemp < 350) {
        tempClass = 'Temperate World';
        tempDesc = 'Moderate temperature, liquid water possible';
    } else if (eqTemp < 600) {
        tempClass = 'Hot World';
        tempDesc = 'High temperature, likely no liquid water';
    } else {
        tempClass = 'Ultra-Hot World';
        tempDesc = 'Extreme heat, molten surface possible';
    }
    
    const result = `
        <h3>🪐 Planet Classification</h3>
        
        <div class="analysis-section">
            <h4>Type Classification</h4>
            <div class="badge ${color}" style="font-size: 1.1em; padding: 10px 20px; margin: 10px 0;">
                ${type}
            </div>
            <div class="analysis-item">${description}</div>
            <div class="analysis-item" style="font-style: italic; color: #a0aec0;">${examples}</div>
        </div>
        
        <div class="analysis-section">
            <h4>Mass Classification</h4>
            <div class="analysis-item">Planet Mass: ${massEarth.toFixed(2)} M⊕</div>
            <div class="analysis-item">Jupiter Masses: ${mass.toFixed(3)} M♃</div>
            <div class="analysis-item">Relative to Earth: ${massEarth > 1 ? (massEarth.toFixed(1) + 'x heavier') : (massEarth.toFixed(2) + 'x lighter')}</div>
        </div>
        
        <div class="analysis-section">
            <h4>Temperature Classification</h4>
            <div class="badge badge-info" style="font-size: 1em; padding: 8px 16px;">
                ${tempClass}
            </div>
            <div class="analysis-item">${tempDesc}</div>
            <div class="analysis-item">Equilibrium Temp: ${eqTemp > 0 ? eqTemp + ' K' : 'Unknown'}</div>
        </div>
    `;
    
    showAnalysisResult(result);
}

function compareToEarth() {
    if (!selectedPlanet) {
        showAnalysisResult('<p style="text-align: center; padding: 40px;">Please select a planet first</p>');
        return;
    }
    
    const mass = parseFloat(selectedPlanet['Mass']) || 0;
    const massEarth = mass / 317.8;
    const semiMajorAxis = parseFloat(selectedPlanet['Orbit Semi-Major Axis']) || 0;
    const orbitalPeriod = parseFloat(selectedPlanet['Orbital Period Days']) || 0;
    const eqTemp = parseFloat(selectedPlanet['Equilibrium Temperature']) || 0;
    const eccentricity = parseFloat(selectedPlanet['Eccentricity']) || 0;
    const stellarTemp = parseFloat(selectedPlanet['Stellar Effective Temperature']) || 0;
    
    let score = 0;
    let notes = [];
    
    if (massEarth >= 0.5 && massEarth <= 2) {
        score += 25;
        notes.push('✓ Similar mass to Earth');
    } else {
        notes.push('✗ Very different mass');
    }
    
    if (semiMajorAxis >= 0.7 && semiMajorAxis <= 1.5) {
        score += 25;
        notes.push('✓ Similar orbital distance');
    } else {
        notes.push('✗ Very different orbital distance');
    }
    
    if (eqTemp >= 250 && eqTemp <= 300) {
        score += 25;
        notes.push('✓ Similar temperature');
    } else if (eqTemp >= 200 && eqTemp <= 350) {
        score += 15;
        notes.push('~ Somewhat similar temperature');
    } else {
        notes.push('✗ Very different temperature');
    }
    
    if (eccentricity < 0.1) {
        score += 15;
        notes.push('✓ Similar orbital shape');
    } else {
        notes.push('~ Different orbital shape');
    }
    
    if (stellarTemp >= 5000 && stellarTemp <= 6500) {
        score += 10;
        notes.push('✓ Similar star type');
    } else {
        notes.push('~ Different star type');
    }
    
    let verdict;
    if (score >= 70) verdict = 'Very similar to Earth!';
    else if (score >= 50) verdict = 'Moderately similar to Earth';
    else if (score >= 30) verdict = 'Somewhat Earth-like';
    else verdict = 'Very different from Earth';
    
    const result = `
        <h3>🌎 Comparison with Earth</h3>
        
        <div class="analysis-section">
            <h4>Similarity Assessment</h4>
            <div class="badge ${score >= 50 ? 'badge-success' : score >= 30 ? 'badge-warning' : 'badge-danger'}" 
                 style="font-size: 1em; padding: 8px 16px;">
                ${verdict} (${score}/100)
            </div>
            ${notes.map(n => `<div class="analysis-item">${n}</div>`).join('')}
        </div>
        
        <div class="analysis-section">
            <h4>Physical Properties</h4>
            <div class="analysis-item">
                <strong>Mass:</strong> ${massEarth.toFixed(2)} M⊕ 
                ${massEarth > 1.5 ? '(Much heavier than Earth)' : massEarth > 0.8 ? '(Similar to Earth)' : '(Lighter than Earth)'}
            </div>
            <div class="analysis-item">
                <strong>Temperature:</strong> ${eqTemp > 0 ? eqTemp + ' K (Earth: 255 K)' : 'Unknown'}
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Orbital Properties</h4>
            <div class="analysis-item">
                <strong>Distance from Star:</strong> ${semiMajorAxis.toFixed(3)} AU (Earth: 1.0 AU)
            </div>
            <div class="analysis-item">
                <strong>Orbital Period:</strong> ${orbitalPeriod.toFixed(1)} days (Earth: 365.25 days)
            </div>
            <div class="analysis-item">
                <strong>Year Length:</strong> ${(orbitalPeriod / 365.25).toFixed(2)} Earth years
            </div>
        </div>
    `;
    
    showAnalysisResult(result);
}

function analyzeOrbit() {
    if (!selectedPlanet) {
        showAnalysisResult('<p style="text-align: center; padding: 40px;">Please select a planet first</p>');
        return;
    }
    
    const semiMajorAxis = parseFloat(selectedPlanet['Orbit Semi-Major Axis']) || 0;
    const eccentricity = parseFloat(selectedPlanet['Eccentricity']) || 0;
    const orbitalPeriod = parseFloat(selectedPlanet['Orbital Period Days']) || 0;
    
    const perihelion = semiMajorAxis * (1 - eccentricity);
    const aphelion = semiMajorAxis * (1 + eccentricity);
    const tidalLocked = (semiMajorAxis < 0.1 || orbitalPeriod < 10);
    const velocity = 2 * Math.PI * semiMajorAxis * 149597870.7 / (orbitalPeriod * 86400);
    
    const result = `
        <h3>🛸 Orbital Dynamics Analysis</h3>
        
        <div class="analysis-section">
            <h4>Orbital Shape</h4>
            <div class="analysis-item">
                <strong>Eccentricity:</strong> ${eccentricity.toFixed(4)}
                <span class="badge ${eccentricity < 0.05 ? 'badge-success' : eccentricity < 0.2 ? 'badge-warning' : 'badge-danger'}">
                    ${eccentricity < 0.05 ? 'Nearly Circular' : eccentricity < 0.2 ? 'Slightly Elliptical' : 'Highly Elliptical'}
                </span>
            </div>
            <div class="analysis-item">
                <strong>Closest Approach:</strong> ${perihelion.toFixed(4)} AU
            </div>
            <div class="analysis-item">
                <strong>Farthest Distance:</strong> ${aphelion.toFixed(4)} AU
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Tidal Effects</h4>
            <div class="analysis-item">
                <strong>Tidal Locking Probability:</strong>
                <span class="badge ${tidalLocked ? 'badge-warning' : 'badge-success'}">
                    ${tidalLocked ? 'LIKELY TIDALLY LOCKED' : 'Probably NOT tidally locked'}
                </span>
            </div>
            ${tidalLocked ? `
                <div class="analysis-item">• One side always faces the star</div>
                <div class="analysis-item">• Extreme temperature differences between sides</div>
            ` : `
                <div class="analysis-item">• Planet has day/night cycle</div>
                <div class="analysis-item">• More uniform temperature distribution</div>
            `}
        </div>
        
        <div class="analysis-section">
            <h4>Orbital Velocity</h4>
            <div class="analysis-item">
                <strong>Average Speed:</strong> ${velocity.toFixed(2)} km/s
            </div>
            <div class="analysis-item">Earth's orbital speed: 29.78 km/s</div>
        </div>
    `;
    
    showAnalysisResult(result);
}

function analyzeStar() {
    if (!selectedPlanet) {
        showAnalysisResult('<p style="text-align: center; padding: 40px;">Please select a planet first</p>');
        return;
    }
    
    const stellarMass = parseFloat(selectedPlanet['Stellar Mass']) || 0;
    const stellarRadius = parseFloat(selectedPlanet['Stellar Radius']) || 0;
    const stellarTemp = parseFloat(selectedPlanet['Stellar Effective Temperature']) || 0;
    const spectralType = selectedPlanet['Spectral Type'] || 'Unknown';
    
    const luminosity = Math.pow(stellarMass, 3.5);
    const lifetime = 10 * Math.pow(stellarMass, -2.5);
    
    let starClass, starDesc;
    if (stellarTemp > 7500) {
        starClass = 'A-type (White)';
        starDesc = 'Hot and white';
    } else if (stellarTemp > 6000) {
        starClass = 'F-type (Yellow-white)';
        starDesc = 'Slightly hotter than the Sun';
    } else if (stellarTemp > 5200) {
        starClass = 'G-type (Yellow)';
        starDesc = 'Sun-like star';
    } else if (stellarTemp > 3700) {
        starClass = 'K-type (Orange)';
        starDesc = 'Cooler orange dwarf';
    } else {
        starClass = 'M-type (Red)';
        starDesc = 'Cool red dwarf';
    }
    
    const result = `
        <h3>⭐ Host Star Analysis</h3>
        
        <div class="analysis-section">
            <h4>Star Classification</h4>
            <div class="analysis-item">
                <strong>Spectral Type:</strong> ${spectralType}
                ${stellarTemp > 0 ? `(${starClass})` : ''}
            </div>
            <div class="analysis-item">${starDesc}</div>
        </div>
        
        ${stellarMass > 0 ? `
            <div class="analysis-section">
                <h4>Physical Properties</h4>
                <div class="analysis-item">
                    <strong>Mass:</strong> ${stellarMass.toFixed(2)} M☉
                </div>
                <div class="analysis-item">
                    <strong>Luminosity:</strong> ${luminosity.toFixed(2)} L☉
                </div>
                <div class="analysis-item">
                    <strong>Estimated Lifetime:</strong> ${lifetime.toFixed(1)} billion years
                    (Sun: ~10 billion years)
                </div>
            </div>
        ` : ''}
        
        ${stellarTemp > 0 ? `
            <div class="analysis-section">
                <h4>Temperature</h4>
                <div class="analysis-item">
                    <strong>Effective Temperature:</strong> ${stellarTemp.toFixed(0)} K
                    (Sun: 5,778 K)
                </div>
            </div>
        ` : ''}
    `;
    
    showAnalysisResult(result);
}

function findSimilar() {
    if (!selectedPlanet) {
        showAnalysisResult('<p style="text-align: center; padding: 40px;">Please select a planet first</p>');
        return;
    }
    
    const mass = parseFloat(selectedPlanet['Mass']) || 0;
    const massEarth = mass / 317.8;
    const semiMajorAxis = parseFloat(selectedPlanet['Orbit Semi-Major Axis']) || 0;
    const eqTemp = parseFloat(selectedPlanet['Equilibrium Temperature']) || 0;
    
    const similar = allPlanets.filter(p => {
        if (p['Planet Name'] === selectedPlanet['Planet Name']) return false;
        
        const pMass = parseFloat(p['Mass']) || 0;
        const pMassEarth = pMass / 317.8;
        const pAxis = parseFloat(p['Orbit Semi-Major Axis']) || 0;
        const pTemp = parseFloat(p['Equilibrium Temperature']) || 0;
        
        const massMatch = Math.abs(massEarth - pMassEarth) / Math.max(massEarth, pMassEarth, 0.001) < 0.3;
        const distMatch = Math.abs(semiMajorAxis - pAxis) / Math.max(semiMajorAxis, pAxis, 0.001) < 0.3;
        const tempMatch = eqTemp > 0 && pTemp > 0 ? Math.abs(eqTemp - pTemp) < 100 : false;
        
        return (massMatch && distMatch) || (massMatch && tempMatch) || (distMatch && tempMatch);
    }).slice(0, 10);
    
    const result = `
        <h3>🔎 Similar Planets</h3>
        <div class="analysis-section">
            <h4>Search Criteria</h4>
            <div class="analysis-item">Mass: ${massEarth.toFixed(2)} M⊕</div>
            <div class="analysis-item">Orbital Distance: ${semiMajorAxis.toFixed(3)} AU</div>
            ${eqTemp > 0 ? `<div class="analysis-item">Temperature: ${eqTemp.toFixed(0)} K</div>` : ''}
        </div>
        
        <div class="analysis-section">
            <h4>Found ${similar.length} Similar Planet${similar.length !== 1 ? 's' : ''}</h4>
            ${similar.length > 0 ? similar.map(p => {
                const pMass = parseFloat(p['Mass']) || 0;
                const pMassEarth = (pMass / 317.8).toFixed(2);
                const pAxis = parseFloat(p['Orbit Semi-Major Axis']) || 0;
                const pTemp = parseFloat(p['Equilibrium Temperature']) || 0;
                
                return `
                    <div class="analysis-item" style="cursor: pointer; padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 6px; margin: 8px 0;"
                         onclick="selectPlanetFromAutocomplete('${p['Planet Name'].replace(/'/g, "\\'")}')">
                        <strong>${p['Planet Name']}</strong><br>
                        <small style="color: #a0aec0;">
                            Mass: ${pMassEarth} M⊕ • 
                            Distance: ${pAxis.toFixed(3)} AU
                            ${pTemp > 0 ? ` • Temp: ${pTemp.toFixed(0)} K` : ''}
                        </small>
                    </div>
                `;
            }).join('') : '<div class="analysis-item">No similar planets found in database</div>'}
        </div>
    `;
    
    showAnalysisResult(result);
}

function showAnalysisResult(html) {
    document.getElementById('analysisResult').innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    loadEmbeddedData();
});