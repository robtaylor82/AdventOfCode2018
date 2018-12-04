/*
https://adventofcode.com/2018/day/4

--- Day 4: Repose Record ---
You've sneaked into another supply closet - this time, it's across from the prototype suit manufacturing lab. You need to sneak inside and fix the issues with the suit, but there's a guard stationed outside the lab, so this is as close as you can safely get.

As you search the closet for anything that might help, you discover that you're not the first person to want to sneak in. Covering the walls, someone has spent an hour starting every midnight for the past few months secretly observing this guard post! They've been writing down the ID of the one guard on duty that night - the Elves seem to have decided that one guard was enough for the overnight shift - as well as when they fall asleep or wake up while at their post (your puzzle input).

For example, consider the following records, which have already been organized into chronological order:

[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
Timestamps are written using year-month-day hour:minute format. The guard falling asleep or waking up is always the one whose shift most recently started. Because all asleep/awake times are during the midnight hour (00:00 - 00:59), only the minute portion (00 - 59) is relevant for those events.

Visually, these records show that the guards are asleep at these times:

Date   ID   Minute
            000000000011111111112222222222333333333344444444445555555555
            012345678901234567890123456789012345678901234567890123456789
11-01  #10  .....####################.....#########################.....
11-02  #99  ........................................##########..........
11-03  #10  ........................#####...............................
11-04  #99  ....................................##########..............
11-05  #99  .............................................##########.....
The columns are Date, which shows the month-day portion of the relevant day; ID, which shows the guard on duty that day; and Minute, which shows the minutes during which the guard was asleep within the midnight hour. (The Minute column's header shows the minute's ten's digit in the first row and the one's digit in the second row.) Awake is shown as ., and asleep is shown as #.

Note that guards count as asleep on the minute they fall asleep, and they count as awake on the minute they wake up. For example, because Guard #10 wakes up at 00:25 on 1518-11-01, minute 25 is marked as awake.

If you can figure out the guard most likely to be asleep at a specific time, you might be able to trick that guard into working tonight so you can have the best chance of sneaking in. You have two strategies for choosing the best guard/minute combination.

Strategy 1: Find the guard that has the most minutes asleep. What minute does that guard spend asleep the most?

In the example above, Guard #10 spent the most minutes asleep, a total of 50 minutes (20+25+5), while Guard #99 only slept for a total of 30 minutes (10+10+10). Guard #10 was asleep most during minute 24 (on two days, whereas any other minute the guard was asleep was only seen on one day).

While this example listed the entries in chronological order, your entries are in the order you found them. You'll need to organize them before they can be analyzed.

What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 10 * 24 = 240.)
*/


'use strict';

var chai = require('chai'), expect = chai.expect;
chai.should();

// Part 1

Array.prototype.default = function (what, length) {
    while (length) this[--length] = what;
    return this;
};

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

function Shift(guardId) {
    this.guardId = guardId;
    this.minutes = [].default(0, 59);
}

Shift.prototype.getTotalMinutesAsleep = function () {
    return this.minutes.filter(x => x === 1).length;
};

var GuardAction = Object.freeze({
    "begins shift": 1,
    "falls asleep": 2,
    "wakes up": 3
});


function parseInputIntoGuardEvents(input) {
    var results = [];
    input.split("\n").forEach(row => results.push(parseInputRow(row)));
    results.sort(function (a, b) {
        return a.date - b.date;
    });

    return results;
}

function parseInputRow(inputRow) {
    var guardEvent = {
        date: new Date(Date.parse(inputRow.substr(1, 16)))
    };

    if (inputRow.indexOf('#') !== -1) {
        guardEvent.action = GuardAction["begins shift"];
        guardEvent.id = parseInt(inputRow.substr(26, 4));
    } else if (inputRow.indexOf('wakes up') !== -1) {
        guardEvent.action = GuardAction["wakes up"];
    } else if (inputRow.indexOf('falls asleep') !== -1) {
        guardEvent.action = GuardAction["falls asleep"];
    }

    return guardEvent;
}

function buildShiftDetails(guardEvents) {
    var shifts = [];
    var shift;

    for (var i = 0; i < guardEvents.length; i++) {

        var currentEvent = guardEvents[i];
        var nextEvent = guardEvents[i + 1];

        if (currentEvent.action === GuardAction["begins shift"]) {
            shift = new Shift(currentEvent.id);
        }

        if (currentEvent.action === GuardAction["falls asleep"]) {
            var minuteFellAsleep = currentEvent.date.getMinutes();
            var minutesAsleep = (nextEvent.date - currentEvent.date) / 60000;

            for (var n = minuteFellAsleep; n < minuteFellAsleep + minutesAsleep; n++) {
                shift.minutes[n] = 1;
            }
        }

        if (!nextEvent || nextEvent.action === GuardAction["begins shift"]) {
            shifts.push(shift);
        }
    }

    return shifts;
}

function findGuardWhoSleptTheMost(shiftDetails) {
    var guardSleepMinutes = {};

    shiftDetails.forEach(shift => {
        if (!guardSleepMinutes[shift.guardId]) {
            guardSleepMinutes[shift.guardId] = shift.getTotalMinutesAsleep();
        } else {
            guardSleepMinutes[shift.guardId] += shift.getTotalMinutesAsleep();
        }
    });

    var max = {
        guardId: null,
        total: 0
    };

    for (var key in guardSleepMinutes) {
        if (guardSleepMinutes[key] > max.total) {
            max.guardId = key;
            max.total = guardSleepMinutes[key];
        }
    }

    return parseInt(max.guardId);
}

function findMinuteMostCommonlySleptOn(guardId, shiftDetails) {
    shiftDetails = shiftDetails.filter(x => x.guardId === guardId);

    while (shiftDetails.length !== 1) {
        var lastShift = shiftDetails.pop();

        for (var i = 0; i < 59; i++) {
            shiftDetails[0].minutes[i] = shiftDetails[0].minutes[i] + lastShift.minutes[i];
        }
    }

    return shiftDetails[0].minutes.indexOf(shiftDetails[0].minutes.max());
}

var fs = require('fs');
var input = fs.readFileSync('day04-input.txt').toString();
var guardEvents = parseInputIntoGuardEvents(input);
var shiftDetails = buildShiftDetails(guardEvents);
var guardWhoSleptTheMost = findGuardWhoSleptTheMost(shiftDetails);
var minuteMostCommonlySlepOn = findMinuteMostCommonlySleptOn(guardWhoSleptTheMost, shiftDetails);

console.log("Guard who slept the most " + guardWhoSleptTheMost + ", and the most common minute to be asleep was 00:" + minuteMostCommonlySlepOn);
console.log("Puzzle Answer: " + guardWhoSleptTheMost * minuteMostCommonlySlepOn);
//Tests

describe('test parse input row', function () {
    it('guard starts shift, id should be mapped correctly', function () {
        parseInputRow('[1518-05-22 23:50] Guard #1 begins shift').id.should.be.equal(1);
    });

    it('guard starts shift, id should be mapped correctly (2)', function () {
        parseInputRow('[1518-05-22 23:50] Guard #1234 begins shift').id.should.be.equal(1234);
    });

    it('guard starts shift, event type should be mapped correctly', function () {
        parseInputRow('[1518-05-22 23:50] Guard #1234 begins shift').action.should.be.equal(GuardAction["begins shift"]);
    });

    it('guard falls asleep, event type should be mapped correctly', function () {
        parseInputRow('[1518-04-12 00:25] falls asleep').action.should.be.equal(GuardAction["falls asleep"]);
    });

    it('guard wakes up, event type should be mapped correctly', function () {
        parseInputRow('[1518-06-29 00:04] wakes up').action.should.be.equal(GuardAction["wakes up"]);
    });
});

describe('test build shift details', function () {
    it('guard sleeps for one minute', function () {
        var guardEvents = [];
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:01] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:02] wakes up'));
        buildShiftDetails(guardEvents)[0].getTotalMinutesAsleep().should.be.equal(1);
    });
    it('guard sleeps for two minutes', function () {
        var guardEvents = [];
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:01] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:03] wakes up'));
        buildShiftDetails(guardEvents)[0].getTotalMinutesAsleep().should.be.equal(2);
    });
    it('guard sleeps for four minutes', function () {
        var guardEvents = [];
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:01] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:03] wakes up'));
        guardEvents.push(parseInputRow('[2018-01-01 00:05] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:07] wakes up'));
        buildShiftDetails(guardEvents)[0].getTotalMinutesAsleep().should.be.equal(4);
    });
    it('guard sleeps for sixty minutes', function () {
        var guardEvents = [];
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:00] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 01:00] wakes up'));
        buildShiftDetails(guardEvents)[0].getTotalMinutesAsleep().should.be.equal(60);
    });
});

describe('find guard who slept the most', function () {
    it('guard id 2 slept the most', function () {
        var guardEvents = [];
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:00] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:01] wakes up'));
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #2 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:00] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:03] wakes up'));
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:06] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:07] wakes up'));
        findGuardWhoSleptTheMost(buildShiftDetails(guardEvents)).should.be.equal(2);
    });
});

describe('find the minute most commonly slept on', function () {
    it('guard id 1 slept on minute one the most', function () {
        var guardEvents = [];
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:01] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:02] wakes up'));
        guardEvents.push(parseInputRow('[2018-01-01 00:00] Guard #1 begins shift'));
        guardEvents.push(parseInputRow('[2018-01-01 00:01] falls asleep'));
        guardEvents.push(parseInputRow('[2018-01-01 00:03] wakes up'));
        findMinuteMostCommonlySleptOn(1, buildShiftDetails(guardEvents)).should.be.equal(1);
    });
});

describe('example from puzzle description', function () {
    it('guard id 10 slept on minute 24 the most', function () {
        var guardEvents = [];

        guardEvents.push(parseInputRow('[1518-11-01 00:00] Guard #10 begins shift'));
        guardEvents.push(parseInputRow('[1518-11-01 00:05] falls asleep'));
        guardEvents.push(parseInputRow('[1518-11-01 00:25] wakes up'));
        guardEvents.push(parseInputRow('[1518-11-01 00:30] falls asleep'));
        guardEvents.push(parseInputRow('[1518-11-01 00:55] wakes up'));
        guardEvents.push(parseInputRow('[1518-11-01 23:58] Guard #99 begins shift'));
        guardEvents.push(parseInputRow('[1518-11-02 00:40] falls asleep'));
        guardEvents.push(parseInputRow('[1518-11-02 00:50] wakes up'));
        guardEvents.push(parseInputRow('[1518-11-03 00:05] Guard #10 begins shift'));
        guardEvents.push(parseInputRow('[1518-11-03 00:24] falls asleep'));
        guardEvents.push(parseInputRow('[1518-11-03 00:29] wakes up'));
        guardEvents.push(parseInputRow('[1518-11-04 00:02] Guard #99 begins shift'));
        guardEvents.push(parseInputRow('[1518-11-04 00:36] falls asleep'));
        guardEvents.push(parseInputRow('[1518-11-04 00:46] wakes up'));
        guardEvents.push(parseInputRow('[1518-11-05 00:03] Guard #99 begins shift'));
        guardEvents.push(parseInputRow('[1518-11-05 00:45] falls asleep'));
        guardEvents.push(parseInputRow('[1518-11-05 00:55] wakes up'));
        findGuardWhoSleptTheMost(buildShiftDetails(guardEvents)).should.be.equal(10);
        findMinuteMostCommonlySleptOn(10, buildShiftDetails(guardEvents)).should.be.equal(24);
    });
});