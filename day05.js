/*

https://adventofcode.com/2018/day/5

--- Day 5: Alchemical Reduction ---
You've managed to sneak in to the prototype suit manufacturing lab. The Elves are making decent progress, but are still struggling with the suit's size reduction capabilities.

While the very latest in 1518 alchemical technology might have solved their problem eventually, you can do better. You scan the chemical composition of the suit's material and discover that it is formed by extremely long polymers (one of which is available as your puzzle input).

The polymer is formed by smaller units which, when triggered, react with each other such that two adjacent units of the same type and opposite polarity are destroyed. Units' types are represented by letters; units' polarity is represented by capitalization. For instance, r and R are units with the same type but opposite polarity, whereas r and s are entirely different types and do not react.

For example:

In aA, a and A react, leaving nothing behind.
In abBA, bB destroys itself, leaving aA. As above, this then destroys itself, leaving nothing.
In abAB, no two adjacent units are of the same type, and so nothing happens.
In aabAAB, even though aa and AA are of the same type, their polarities match, and so nothing happens.
Now, consider a larger example, dabAcCaCBAcCcaDA:

dabAcCaCBAcCcaDA  The first 'cC' is removed.
dabAaCBAcCcaDA    This creates 'Aa', which is removed.
dabCBAcCcaDA      Either 'cC' or 'Cc' are removed (the result is the same).
dabCBAcaDA        No further actions can be taken.
After all possible reactions, the resulting polymer contains 10 units.

How many units remain after fully reacting the polymer you scanned? (Note: in this puzzle and others, the input is large; if you copy/paste your input, make sure you get the whole thing.)

--- Part Two ---
Time to improve the polymer.

One of the unit types is causing problems; it's preventing the polymer from collapsing as much as it should. Your goal is to figure out which unit type is causing the most problems, remove all instances of it (regardless of polarity), fully react the remaining polymer, and measure its length.

For example, again using the polymer dabAcCaCBAcCcaDA from above:

Removing all A/a units produces dbcCCBcCcD. Fully reacting this polymer produces dbCBcD, which has length 6.
Removing all B/b units produces daAcCaCAcCcaDA. Fully reacting this polymer produces daCAcaDA, which has length 8.
Removing all C/c units produces dabAaBAaDA. Fully reacting this polymer produces daDA, which has length 4.
Removing all D/d units produces abAcCaCBAcCcaA. Fully reacting this polymer produces abCBAc, which has length 6.
In this example, removing all C/c units was best, producing the answer 4.

What is the length of the shortest polymer you can produce by removing all units of exactly one type and fully reacting the result?



*/

'use strict';

var chai = require('chai'), expect = chai.expect;
chai.should();

var input = require('fs').readFileSync('day05-input.txt').toString().trim();

String.prototype.characterCaseMatches = function (other) {
    var otherIsUpperCase;
    var thisIsUpperCase;

    if(other.toUpperCase() === other){
        otherIsUpperCase = true;
    }

    if(this.toUpperCase() === this){
        thisIsUpperCase = true;
    }

    return otherIsUpperCase === thisIsUpperCase;
};

// Part 1

function calculatePolymerReactions(polymer){

    var units = polymer.split('');

    for(var i=0; i < units.length; i++){
        var currentUnit = units[i];
        var nextUnit = units[i+1];

        if(!nextUnit){
            continue;
        }

        if(currentUnit.toUpperCase() === nextUnit.toUpperCase() && !currentUnit.characterCaseMatches(nextUnit)){
            units.splice(i, 2);
            i = -1;
        }
    }

    return units.join('');
}

console.log('resulting polymer should be ' + calculatePolymerReactions(input).length + ' units long.');


describe('test calculatePolymerReactions function', function(){
    it("aA Polymer should react and result in a blank string", function(){
        calculatePolymerReactions('aA').should.be.equal('');
    });
    it("AA Polymer should not react", function(){
        calculatePolymerReactions('AA').should.be.equal('AA');
    });
    it("aa Polymer should not react", function(){
        calculatePolymerReactions('aa').should.be.equal('aa');
    });
    it("In abBA, bB destroys itself, leaving aA. As above, this then destroys itself, leaving nothing.", function(){
        calculatePolymerReactions('abBA').should.be.equal('');
    });
    it("In abAB, no two adjacent units are of the same type, and so nothing happens.", function(){
        calculatePolymerReactions('abAB').should.be.equal('abAB');
    });it("In aabAAB, even though aa and AA are of the same type, their polarities match, and so nothing happens.", function(){
        calculatePolymerReactions('aabAAB').should.be.equal('aabAAB');
    });
    it("aB Polymer should not react", function(){
        calculatePolymerReactions('aB').should.be.equal('aB');
    });
    it("aAa Polymer should react and result in a string of a", function(){
        calculatePolymerReactions('aAa').should.be.equal('a');
    });
    it("baAB Polymer should react and result in a blank string", function(){
        calculatePolymerReactions('baAB').should.be.equal('');
    });
    it("dabAcCaCBAcCcaDA Polymer should react until the remaining units read dabCBAcaDA", function(){
        calculatePolymerReactions('dabAcCaCBAcCcaDA').should.be.equal('dabCBAcaDA');
    });
    it("dabAcCaCBAcCcaDA Resulting polymer should be 10 units long", function(){
        calculatePolymerReactions('dabAcCaCBAcCcaDA').length.should.be.equal(10);
    });
});


/// Part 2

function findProblamaticUnitType(polymer){
    var distinctUnitTypes = polymer.toLowerCase().split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    var results = [];

    distinctUnitTypes.forEach(unitType => results.push({unitType: unitType, length: calculatePolymerReactions(removeUnitType(polymer, unitType)).length}));

    return results.sort(function (a, b) { return a.length - b.length;})[0];
}

function removeUnitType(polymer, unitType){
    var replaceAllPositive = new RegExp(unitType.toUpperCase(), "g");
    var replaceAllNegative = new RegExp(unitType.toLowerCase(), "g");
    return polymer.replace(replaceAllNegative, '').replace(replaceAllPositive, '');
}

var result = findProblamaticUnitType(input);
console.log('length of the shortest polymer you can produce is ' + result.polymerLength + ', found by removed unit type ' + result.removedUnitType);    


describe('test findProblamaticUnitTypes function', function(){
    it("Removing all A/a units produces dbcCCBcCcD.", function(){
        removeUnitType('dabAcCaCBAcCcaDA', 'a').should.be.equal('dbcCCBcCcD');
    });
    it("for the polymer dabAcCaCBAcCcaDA, removing all c units is best producing the answer 4", function(){
        findProblamaticUnitType('dabAcCaCBAcCcaDA').length.should.be.equal(4);
        findProblamaticUnitType('dabAcCaCBAcCcaDA').unitType.should.be.equal('c');
    });
});