export function getCurrentPhase(startDate, cycleLength, menstruationStart, follicularStart, ovulationStart, lutealStart) {
    let today = new Date();
    let dayOfCycle = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    let daysToMenstruation = Math.max(Math.ceil((menstruationStart - today) / (1000 * 60 * 60 * 24) - 1), 0); // convert from milliseconds to days

    // determine current phase
    let currentPhase;
    if (menstruationStart < today) {
        currentPhase = 'Menstrual';
    } else if (follicularStart < today) {
        currentPhase = 'Follicular';
    } else if (ovulationStart < today) {
        currentPhase = 'Ovulation';
    } else if (lutealStart < today){
        currentPhase = 'Luteal';
    }

    return {
        dayOfCycle: dayOfCycle,
        currentPhase: currentPhase,
        daysToMenstruation: daysToMenstruation
    };
}

export function getPhases(age, weight, height, lastMenstruation, menstrualFlowDuration, caloricIntake, exercise, sexualActivity, flowVolume) {
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

    let follicularStart = new Date(startDate);
    let ovulationStart = new Date(startDate);
    let lutealStart = new Date(startDate);
    let menstruationStart = new Date(startDate);

    // calculate dates
    follicularStart.setDate(startDate.getDate() + menstrualPhase);
    ovulationStart.setDate(follicularStart.getDate() + follicularPhase);
    lutealStart.setDate(ovulationStart.getDate() + ovulationPhase);
    menstruationStart.setDate(startDate.getDate() + cycleLength);

    // calculate day and phase
    let {
        dayOfCycle,
        currentPhase,
        daysToMenstruation,
    } = getCurrentPhase(startDate, cycleLength, menstruationStart, follicularPhase, ovulationPhase, lutealPhase);

    // return info
    return {
        follicularStart: follicularStart,
        ovulationStart: ovulationStart,
        lutealStart: lutealStart,
        menstruationStart: menstruationStart,
        daysToMenstruation: daysToMenstruation,
        dayOfCycle: dayOfCycle,
        currentPhase: currentPhase
    };
}