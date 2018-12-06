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
*/

// Setup

'use strict';

var chai = require('chai'), expect = chai.expect;
chai.should();

var input = require('fs').readFileSync('day05-input.txt').toString();

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
            i--;
        }
    }

    return units.join('');
}

// SOLVE PROBLEM HERE

console.log('resulting polymer should be ' + calculatePolymerReactions(input).length + ' units long.');

// TESTS HERE

describe('test calculatePolymerReactions function', function(){
    it("aA Polymer should react and result in a blank string", function(){
        calculatePolymerReactions('aA').should.be.equal('');
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
    it("dabCBAcaDA        Resulting polymer should be 10 units long", function(){
        calculatePolymerReactions('dabAcCaCBAcCcaDA').length.should.be.equal(10);
    });
});