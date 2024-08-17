import {getPhases} from "./calculator.js";

const DATE_FORMAT = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('input[type="submit"]').addEventListener('click', function (event) {
        event.preventDefault();

        const age = parseInt(document.getElementById('age').value);
        const weight = parseInt(document.getElementById('weight').value);
        const height = parseInt(document.getElementById('height').value);
        const lastMenstruation = document.getElementById('lmp').value;
        const menstrualFlowDuration = parseInt(document.getElementById('flowtime').value);
        const caloricIntake = parseInt(document.getElementById('diet').value);
        const exercise = parseInt(document.getElementById('exercise').value);
        const sexualActivity = parseInt(document.getElementById('freaky').value);
        const flowVolume = parseInt(document.getElementById('flow').value);

        const result = getPhases(age, weight, height, lastMenstruation, menstrualFlowDuration, caloricIntake, exercise, sexualActivity, flowVolume);

        if (result.error) {
            alert(result.error)
        } else {
            alert(`Follicular Start: ${result.follicularStart.toLocaleDateString(undefined, DATE_FORMAT)}
            \nOvulation Start: ${result.ovulationStart.toLocaleDateString(undefined, DATE_FORMAT)}
            \nLuteal Start: ${result.lutealStart.toLocaleDateString(undefined, DATE_FORMAT)}
            \nMenstrual Phase Start: ${result.menstruationStart.toLocaleDateString(undefined, DATE_FORMAT)}
            \nDays to Menstruation: ${result.daysToMenstruation}
            \nDay of Cycle: ${result.dayOfCycle}
            \nCurrent Phase: ${result.currentPhase}`);

            localStorage.setItem("follicularStart", toString(result.follicularStart));
            localStorage.setItem("ovulationStart", toString(result.ovulationStart));
            localStorage.setItem("lutealStart", toString(result.lutealStart));
            localStorage.setItem("menstruationStart", toString(result.menstruationStart));
            localStorage.setItem("daysToMenstruation", toString(result.daysToMenstruation));
            localStorage.setItem("dayOfCycle", toString(result.dayOfCycle));
            localStorage.setItem("currentPhase", toString(result.currentPhase));
        }
    });
});