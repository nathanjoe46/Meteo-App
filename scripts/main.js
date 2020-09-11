import tabJourEnOrdre from './Utilitaire/gestionTemps.js';
//console.log("Depuis Main Js " + tabJourEnOrdre)


const cleAPI = '79847217de8065cd934704fcf4624511';
let resultsAPI;
const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure       = document.querySelectorAll('.heure-nom-prevision');
const TempPourH   = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv     = document.querySelectorAll('.jour-prevision-nom');
const tempJourDiv  =  document.querySelectorAll('.jour-prevision-temps');
const imgIcone     = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icon-chargement');


if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{

        // console.log(position)

        const long = position.coords.longitude;
        const lat = position.coords.latitude;

        AppleApi(long, lat);
    }, ()=>{
        alert("Vous avez refuse la geolocation, do it again")
    })
}

function AppleApi(long, lat){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${cleAPI}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
         //console.log(data)
        resultsAPI = data

        temps.innerText = resultsAPI.current.weather[0].description;
        temps.style.color = 'pink'
        temperature.innerText = `${Math.trunc(resultsAPI.current.temp)}°`;
        temperature.style.color = 'pink'
        localisation.innerText = resultsAPI.timezone;
        localisation.style.color = 'pink'

        // les heures par tranche de trois, avec leur temperature
        let heureActuelle = new Date().getHours();

        for(let i= 0; i < heure.length; i++){
            let heurIncr = heureActuelle + i * 3;

            if(heurIncr > 24){
                heure[i].innerText = `${heurIncr - 24} h`
            } else if(heurIncr === 24){
                heure[i].innerText = "00 h"
            }else{
                heure[i].innerText = `${heurIncr} h`
            }

            
        } 

        // temper pour 3h

        for(let j = 0; j < TempPourH.length; j++){
            TempPourH[j].innerText = `${Math.trunc(resultsAPI.hourly[j*3].temp)}°`;
        }

        // Trois premieres lettres des jours
        for(let k = 0; k < joursDiv.length; k++){
            joursDiv[k].innerText = tabJourEnOrdre[k].slice(0,3) 
        }

        // Temps par jour

        for(let m = 0; m < 7; m++){
            tempJourDiv[m].innerText = `${Math.trunc(resultsAPI.daily[m + 1].temp.day)}°`
        }

        // Icone dynamique

        if(heureActuelle >= 6 && heureActuelle < 21){
            imgIcone.src = `ressources/jour/${resultsAPI.current.weather[0].icon}.svg`
        }else{
            imgIcone.src = `ressources/nuit/${resultsAPI.current.weather[0].icon}.svg`
        }

        chargementContainer.classList.add('disparition')

    })
}