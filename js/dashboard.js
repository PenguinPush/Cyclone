import {getCurrentPhase} from "./calculator.js";

const nextPeriod = document.getElementById("next-period")
const statsPeriod = document.getElementById("stats-period")
const statsPhase = document.getElementById("stats-phase")
const statsCycle = document.getElementById("stats-cycle")

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

        const FETCHED_DATA = [
            lastMenstruation,
            cycleLength,
            follicularStart,
            ovulationStart,
            lutealStart,
            menstruationStart
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
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    let [lastMenstruation, cycleLength, follicularStart, ovulationStart, lutealStart, menstruationStart] = FETCHED_DATA;
    let currentPhaseData = getCurrentPhase(...FETCHED_DATA)

    let daysOfCycle = currentPhaseData.dayOfCycle
    let currentPhase = currentPhaseData.currentPhase
    let daysToMenstruation = currentPhaseData.daysToMenstruation

    updateText(nextPeriod, menstruationStart.toLocaleDateString(undefined, DATE_FORMAT_LONG_NOYEAR), 1)

    updateText(statsPeriod, daysToMenstruation, 1)
    updateText(statsPeriod, daysToMenstruation, 2, true)
    updateText(statsPhase, currentPhase, 1)
    updateText(statsCycle, daysOfCycle, 1)
    updateText(statsCycle, cycleLength, 2)
}

function updateText(element, text, id, plural = false) {
    if (plural) {
        if (text !== 1) {
            element.innerHTML = element.innerHTML.replace(`!{${id}}`, "s")
        } else {
            element.innerHTML = element.innerHTML.replace(`!{${id}}`, "")
        }
    } else {
        element.innerHTML = element.innerHTML.replace(`!{${id}}`, text)
    }
}