import {getPhases} from "./calculator.js";

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
            alert(`Follicular Start: ${result.follicularStart}
            \nOvulation Start: ${result.ovulationStart}
            \nLuteal Start: ${result.lutealStart}
            \nMenstrual Phase Start: ${result.menstruationStart}
            \nDays to Menstruation: ${result.daysToMenstruation}
            \nDay of Cycle: ${result.dayOfCycle}
            \nCurrent Phase: ${result.currentPhase}`);
        }
    });
});