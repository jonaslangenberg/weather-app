// Stadtnamen und Landnamen in zugehörige Koordinaten umwandeln
// Diese können im Anschluss für die weather api verwendet werden

// async function getCoordinates(city, country) {
//     const url = "https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&format=json&limit=1";
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data.length > 0) {
//         const location = data[0];
//         var element = document.getElementById("success");
//         element.textContent = "Erfolg! Deine Ergebnisse stehen in kürze bereit.";
//         console.log("WOOOW")
//         console.log(location);
//         //return {latitude: parseFloat(location.lat), longitude: parseFloat(location.lon)};
//     } else{
//         var element = document.getElementById("success");
//         console.log("HILFE")
//         element.textContent = "Kein Erfolg, bitte überprüfe deine Einträge.";
//         return [0, 0];  
//     }
      
// }
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    
    //API Anfrage stellen
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("HTTP-Fehler! Status: ${response.status}");
    }
    const data = await response.json();
    //JSON als Datei speichern
    console.log(data);
    //changeWebsite(data);
}
