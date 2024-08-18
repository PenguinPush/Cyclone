export function getCurrentPhase(lastMenstruation, cycleLength, follicularStart, ovulationStart, lutealStart, menstruationStart, mensturalFlowDuration, today) {
    let dayOfCycle = Math.ceil((today - lastMenstruation) / (1000 * 60 * 60 * 24));
    let daysToMenstruation = Math.max(Math.ceil((menstruationStart - today) / (1000 * 60 * 60 * 24) - 1), 0); // convert from milliseconds to days
    let menstruationEnd = new Date()
    menstruationEnd.setDate(menstruationStart.getDate() + mensturalFlowDuration);

    // determine current phase
    let currentPhase = 'menstrual';
    if (follicularStart <= today) {
        currentPhase = 'follicular';
    }
    if (ovulationStart <= today) {
        currentPhase = 'ovulation';
    }
    if (lutealStart <= today) {
        currentPhase = 'luteal';
    }
    if (menstruationStart <= today) {
        currentPhase = 'menstrual';
    }
    if (menstruationEnd <= today) {
        currentPhase = 'follicular';
    }

    return {
        dayOfCycle: dayOfCycle,
        currentPhase: currentPhase,
        daysToMenstruation: daysToMenstruation
    };
}

export function calculatePhases(age, weight, height, lastMenstruation, menstrualFlowDuration, caloricIntake, exercise, sexualActivity, flowVolume) {
    let startDate = new Date(lastMenstruation);
    let menstruationDelta = (Date.now() - startDate) / (1000 * 60 * 60 * 24)

    // phase assumptions
    let cycleLength = 28;
    let follicularPhase = 7;
    let ovulationPhase = 2;
    let lutealPhase = 14;
    let menstrualPhase = menstrualFlowDuration;

    // adjust cycle length
    cycleLength += (caloricIntake - 2000) / 500;
    cycleLength -= (exercise - 2) * 0.5;
    cycleLength += (3 - sexualActivity) * 0.5;
    cycleLength += (flowVolume - 2) * 0.5;
    cycleLength += (weight - 150) / 50;
    cycleLength += (height - 165) / 10;
    cycleLength += (age - 30) / 10;

    // make sure the phases don't exceed the cycle length
    let phaseTotal = follicularPhase + ovulationPhase + lutealPhase + menstrualPhase;

    if (phaseTotal > cycleLength) {
        let phaseOverflow = Math.ceil(phaseTotal - cycleLength);

        lutealPhase -= Math.ceil(phaseOverflow / 2)
        follicularPhase -= Math.floor(phaseOverflow / 2)
    }

    if (menstruationDelta < 0) {
        return {error: "LAST menstruation date, not in the future!"}
    } else if (40 < menstruationDelta) {
        return {error: "Your last menstruation was really far away... If you're sure this is right, maybe speak to a doctor??"}
    } else if (menstruationDelta > cycleLength) {
        cycleLength = menstruationDelta // if your last menstruation was a little far away, just assume the next one is probably tomorrow
    }

    cycleLength = Math.round(cycleLength);

    let follicularStart = new Date(startDate);
    let ovulationStart = new Date(startDate);
    let lutealStart = new Date(startDate);
    let menstruationStart = new Date(startDate);

    // calculate dates
    follicularStart.setDate(startDate.getDate() + menstrualPhase);
    ovulationStart.setDate(startDate.getDate() + follicularPhase + menstrualPhase);
    lutealStart.setDate(startDate.getDate() + ovulationPhase + follicularPhase + menstrualPhase);
    menstruationStart.setDate(startDate.getDate() + cycleLength);

    // return info
    return {
        cycleLength: cycleLength,
        follicularStart: follicularStart,
        ovulationStart: ovulationStart,
        lutealStart: lutealStart,
        menstruationStart: menstruationStart,
    };
}