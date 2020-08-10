exports.getMonthTimeDuration = function (year, month) {
    let startDay = new Date(year, month - 1, 1);
    let lastDay = new Date(year, month, 0);
    lastDay.setHours(23, 59, 59);
    return {
        startTime: startDay.getTime(),
        endTime: lastDay.getTime()
    }
}
