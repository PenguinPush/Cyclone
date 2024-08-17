import {calculatePhases} from "./calculator.js";

const DATE_FORMAT = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}

const VALUES = [
    "age",
    "weight",
    "height",
    "lmp",
    "flowtime",
    "diet",
    "exercise",
    "freaky",
    "flow"
]

document.addEventListener('DOMContentLoaded', function () {
    setDefaults();

    VALUES.forEach(value => {
        let element = document.getElementById(value)
        element.addEventListener('change', () => {
            localStorage.setItem(value, element.value)
        })
    })

    document.querySelector('input[type="submit"]').addEventListener('click', (event) => {
        event.preventDefault();
        calculateData()
    });
});

function setDefaults() {
    VALUES.forEach(value => {
        if (localStorage.getItem(value)) {
            document.getElementById(value).value = localStorage.getItem(value)
        }
    })
}

function calculateData() {
    const age = parseInt(localStorage.getItem("age"));
    const weight = parseInt(localStorage.getItem("weight"));
    const height = parseInt(localStorage.getItem("height"));
    const lmp = new Date(localStorage.getItem("lmp"));
    const flowtime = parseInt(localStorage.getItem("flowtime"));
    const diet = parseInt(localStorage.getItem("diet"));
    const exercise = parseInt(localStorage.getItem("exercise"));
    const freaky = parseInt(localStorage.getItem("freaky"));
    const flow = parseInt(localStorage.getItem("flow"));

    const result = calculatePhases(age, weight, height, lmp, flowtime, diet, exercise, freaky, flow);

    if (result.error) {
        alert(result.error)
    } else {
        changePage(-1);

        localStorage.setItem("lastMenstruation", new Date(lmp).toString());
        localStorage.setItem("cycleLength", result.cycleLength.toString());
        localStorage.setItem("follicularStart", result.follicularStart.toString());
        localStorage.setItem("ovulationStart", result.ovulationStart.toString());
        localStorage.setItem("lutealStart", result.lutealStart.toString());
        localStorage.setItem("menstruationStart", result.menstruationStart.toString());

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 500);

    }
}

function changePage(id) {
    let page1 = document.querySelector('#page1');
    let page2 = document.querySelector('#page2');
    let page3 = document.querySelector('#page3');
    let progress = document.querySelector('#progress');

    page1.style.transform = `translateY(${(id - 2) * 100}%)`;
    page2.style.transform = `translateY(${(id - 1) * 100}%)`;
    page3.style.transform = `translateY(${(id) * 100}%)`;
    progress.style.width = `${(100 - (100 / 3) * (id + 1))}%`
}

window.changePage = changePage;