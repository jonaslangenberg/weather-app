// Stadtnamen und Landnamen in zugehörige Koordinaten umwandeln
// Diese können im Anschluss für die weather api verwendet werden


async function getCoordinates(city, country) {
    console.log(city);
    console.log(country);
    const url = `https://nominatim.openstreetmap.org/search?city=${city}&coutry=${country}&format=json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response fehlerhaft");
        }
        const data = await response.json();
        
        if (data.length > 0) {
            const location = data[0];
            const coordinates = {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon)
            };
            
            const successElement = document.getElementById("success");
            if (successElement) {
                successElement.textContent = "Erfolg! Deine Ergebnisse stehen in kürze bereit.";
            }
            
            console.log("Koordinaten konnten gefunden werden: ", coordinates);
            return coordinates;
        } else {
            const successElement = document.getElementById("success");
            if (successElement) {
                successElement.textContent = "Kein Erfolg, bitte überprüfe deine Einträge.";
            }
            
            console.log("Koordinaten wurden nicht gefunden");
            return null;
        }
    } catch (error) {
        console.error("Ein Fehler tritt beim sammeln der Koordinaten auf: ", error);
        const successElement = document.getElementById("success");
        if (successElement) {
            successElement.textContent = "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.";
        }
        return null;
    }
}

function changeWebsite(data) {
    const dataToday = data.current;
    //Variablen für den heutigen Tagg
    const tempToday = dataToday.temperature_2m;
    const precipitationToday = dataToday.precipitation;
    const windToday = dataToday.wind_speed_10m;
    const humidityToday = dataToday.relative_humidity_2m;
    //Variablen für heute in Text Elemente einfügen
    document.getElementById("temp").textContent = String(tempToday) + " °C";
    document.getElementById("niederschlag").textContent = String(precipitationToday) + " mm";
    document.getElementById("wind").textContent = String(windToday) + " km/h";
    document.getElementById("luft").textContent = String(humidityToday) + "%";
    if (precipitationToday === 0) {
        if (tempToday > 18){
            document.getElementById("wetterbild").src = "./pictures/sunny.png";
        }
        else {
            document.getElementById("wetterbild").src = "./pictures/cloudy.png";
        }
        
    } else {
        document.getElementById("wetterbild").src = "./pictures/rainy.png";
    }
    //Variablen für die nächsten Tage
    const dailyData = data.daily;
    const dataTempWeek = dailyData.temperature_2m_max;
    const dataPrecepWeek = dailyData.precipitation_sum;
    const dates = dailyData.time;
    for (i = 0; i < 7; i++) {
        document.getElementById(String(i + 1)+"date").textContent = String(dates[i]);
        document.getElementById(String(i + 1)+"temp").textContent = String(dataTempWeek[i]) + " °C";
        document.getElementById(String(i + 1)+"pre").textContent = String(dataPrecepWeek[i]) + " mm";
    }

}

async function getWeatherData() {
    console.log("Passiert überhaupt was?");
    //Daten aus den beiden Eingabefeldern ziehen
    const value1 = document.getElementById("stadt").value;
    const value2 = document.getElementById("land").value;
    //Warten auf die Koordinaten
    let coordinatesLiteral = await getCoordinates(value1, value2);
    //Testen ob die Koordinaten erhalten wurden
    console.log(coordinatesLiteral);
    //Prüfen, ob getCoordinates erfolgreich war oder nicht
    if (coordinatesLiteral.latitude === 0 && coordinatesLiteral.longitude === 0){
        throw new Error("Keine Ergebnisse möglich");
    }
    console.log(coordinatesLiteral.latitude);
    let lon = String(coordinatesLiteral.longitude);
    let lat = String(coordinatesLiteral.latitude);
    // //URL mit einigen Parametern erstellen
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,cloud_cover,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    
    //API Anfrage stellen
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("HTTP-Fehler! Status: ${response.status}");
    }
    const data = await response.json();
    //JSON als Datei speichern
    console.log(data);
    changeWebsite(data);
}
