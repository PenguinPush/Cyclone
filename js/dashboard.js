import {getCurrentPhase} from "./calculator.js";

const nextPeriod = document.getElementById("next-period")
const statsPeriod = document.getElementById("stats-period")
const statsPhase = document.getElementById("stats-phase")
const statsCycle = document.getElementById("stats-cycle")

const weekForecast = document.getElementsByClassName("week-forecast")
const weekIcons = document.getElementsByClassName("week-icon")

document.addEventListener('DOMContentLoaded', function () {
    loadData().then((FETCHED_DATA) => {
        updateSite(FETCHED_DATA);
    });
});

function loadData() {
    return new Promise((resolve, reject) => {
        let lastMenstruation = new Date(Date.parse(localStorage.getItem("lastMenstruation")));
        let cycleLength = Number(localStorage.getItem("cycleLength"));
        let follicularStart = new Date(Date.parse(localStorage.getItem("follicularStart")));
        let ovulationStart = new Date(Date.parse(localStorage.getItem("ovulationStart")));
        let lutealStart = new Date(Date.parse(localStorage.getItem("lutealStart")));
        let menstruationStart = new Date(Date.parse(localStorage.getItem("menstruationStart")));
        let flowtime = Number(localStorage.getItem("flowtime"));

        const FETCHED_DATA = [
            lastMenstruation,
            cycleLength,
            follicularStart,
            ovulationStart,
            lutealStart,
            menstruationStart,
            flowtime
        ];

        for (let item of FETCHED_DATA) {
            if (!item) {
                reject("Missing localStorage data! Go to input_data.html");
                window.location.href = "input_data.html";
                return;
            } else {
                console.log(item)
            }
        }

        resolve(FETCHED_DATA);
    });
}

function updateSite(FETCHED_DATA) {
    const DATE_FORMAT_LONG_NOYEAR = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }

    const DATE_FORMAT_WEEKDAY = {
        weekday: 'long'
    }

    let today = new Date(Date.now())
    let [lastMenstruation, cycleLength, follicularStart, ovulationStart, lutealStart, menstruationStart, flowtime] = FETCHED_DATA;
    let currentPhaseData = getCurrentPhase(...FETCHED_DATA, new Date());

    let daysOfCycle = currentPhaseData.dayOfCycle;
    let currentPhase = currentPhaseData.currentPhase.charAt(0).toUpperCase() + currentPhaseData.currentPhase.slice(1); // capitalize lettering
    let daysToMenstruation = currentPhaseData.daysToMenstruation;

    updateText(nextPeriod, menstruationStart.toLocaleDateString(undefined, DATE_FORMAT_LONG_NOYEAR), 1);

    updateText(statsPeriod, daysToMenstruation, 1);
    updateText(statsPeriod, daysToMenstruation, 2, true);
    updateText(statsPhase, currentPhase, 1);
    updateText(statsCycle, daysOfCycle, 1);
    updateText(statsCycle, cycleLength, 2);

    for (let i = 0; i < 7; i++) {
        let weekday = new Date();
        weekday.setDate(today.getDate() + i);
        updateText(weekForecast[i], weekday.toLocaleDateString(undefined, DATE_FORMAT_WEEKDAY), 1);

        let phase = getCurrentPhase(...FETCHED_DATA, weekday).currentPhase;
        weekIcons[i].style.backgroundImage = `url(./public/${phase}.png)`;
        weekForecast[i].title = phase.charAt(0).toUpperCase() + phase.slice(1);
    }
}

function updateText(element, text, id, plural = false) {
    if (plural) {
        if (text !== 1) {
            element.innerHTML = element.innerHTML.replace(`!{${id}}`, "s");
        } else {
            element.innerHTML = element.innerHTML.replace(`!{${id}}`, "");
        }
    } else {
        element.innerHTML = element.innerHTML.replace(`!{${id}}`, text);
    }
}