// TEMA DE FUNCIONAMIENTO DEL MAPA 
// obtener la ubicaciond el usuario 
document.getElementById('get_location').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Here you would typically use a reverse geocoding service
            document.getElementById('location').value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
            
            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success alert-dismissible fade show mt-2';
            alert.innerHTML = '<i class="fas fa-check-circle me-2"></i>Ubicación obtenida correctamente <button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
            document.getElementById('location').parentNode.parentNode.appendChild(alert);
        }, function(error) {
            alert('Error al obtener la ubicación: ' + error.message);
        });
    } else {
        alert('La geolocalización no es compatible con este navegador.');
    }
});

// desplazamiento suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.hasAttribute('data-bs-toggle') && this.getAttribute('data-bs-toggle') === 'modal') {
            return;
        }
        e.preventDefault();
        const href = this.getAttribute('href');

        if (!href || href === '#') {
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// para despejar alertas despues de 5 segundos
setTimeout(function() {
    document.querySelectorAll('.alert').forEach(function(alert) {
        if (alert.classList.contains('show')) {
            bootstrap.Alert.getOrCreateInstance(alert).close();
        }
    });
}, 5000);

// Inicializa el mapa centrado en Costa Rica
var map = L.map('mapid').setView([9.7489, -83.7534], 8);

// Carga los tiles desde OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);


//ESTOS SON EJEMPLOS PARA QUE SE VEAN EN EL MAPA 
// Ejemplo: marcador en San José
var marker = L.marker([9.9333, -84.0833]).addTo(map)
    .bindPopup('<b>San José</b><br>Ejemplo de incidente<br><small>Fecha: 04/06/2025</small>')
    .openPopup();

// Ejemplo: más marcadores de incidentes
var marker2 = L.marker([10.0, -84.2]).addTo(map)
    .bindPopup('<b>Incidente #001</b><br>Tipo: Accidente de tránsito<br><small>Estado: Resuelto</small>');
var marker3 = L.marker([9.5, -83.8]).addTo(map)
    .bindPopup('<b>Incidente #002</b><br>Tipo: Emergencia médica<br><small>Estado: En proceso</small>');

// Función para añadir nuevos incidentes (ejemplo)
function addIncident(lat, lng, title, description) {
    L.marker([lat, lng]).addTo(map)
        .bindPopup('<b>' + title + '</b><br>' + description);
}

