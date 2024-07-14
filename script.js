// Stadtnamen und Landnamen in zugehörige Koordinaten umwandeln
// Diese können im Anschluss für die weather api verwendet werden

function getCoordinates(city, country) {
    const query = encodeURIComponent(`${city}, ${country}`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
  
    return fetch(url)
        .then(response => response.json())
        .then(data => {
        if (data.length > 0) {
            const { lat, lon } = data[0];
            var element = document.getElementById("success");
            element.textContent = "Erfolg! Deine Ergebnisse stehen in kürze bereit.";
            return [parseFloat(lat), parseFloat(lon)];
        } else {
            var element = document.getElementById("success");
            element.textContent = "Kein Erfolg, bitte überprüfe deine Einträge.";
            return [0, 0];  
        }
      });
}

function changeWebsite(data){

}

//fs importieren
const fs = require('fs');

async function getWeatherData() {
    const value1 = document.getElementById('stadt').value;
    const value2 = document.getElementById('land').value;
    let coordinatesArray = getCoordinates(stadt, land);
    if (coordinatesArray[0] === 0 && coordinatesArray[1] === 0){
        throw new Error("Keine Ergebnisse möglich");
    }
    const apiUrl = 'https://api.open-meteo.com/v1/forecast';
    const params = {
        latitude: coordinatesArray[1],  
        longitude: coordinatesArray[0],
        hourly: 'temperature_2m,precipitation',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        current_weather: true
      };

    const url = new URL(apiUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    const data = await response.json();
    fs.writeFile('data.json', data, (error) => {
        if (error) {
          console.error('Fehler beim Schreiben der Datei:', error);
          throw error;
        }
        console.log('data.json wurde erfolgreich gespeichert.');
      });
    //changeWebsite(data);
}
