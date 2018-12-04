/*
https://adventofcode.com/2018/day/2

You stop falling through time, catch your breath, and check the screen on the device. "Destination reached. Current Year: 1518. Current Location: North Pole Utility Closet 83N10." You made it! Now, to find those anomalies.

Outside the utility closet, you hear footsteps and a voice. "...I'm not sure either. But now that so many people have chimneys, maybe he could sneak in that way?" Another voice responds, "Actually, we've been working on a new kind of suit that would let him fit through tight spaces like that. But, I heard that a few days ago, they lost the prototype fabric, the design plans, everything! Nobody on the team can even seem to remember important details of the project!"

"Wouldn't they have had enough fabric to fill several boxes in the warehouse? They'd be stored together, so the box IDs should be similar. Too bad it would take forever to search the warehouse for two similar box IDs..." They walk too far away to hear any more.

Late at night, you sneak to the warehouse - who knows what kinds of paradoxes you could cause if you were discovered - and use your fancy wrist device to quickly scan every box and produce a list of the likely candidates (your puzzle input).

To make sure you didn't miss any, you scan the likely candidate boxes again, counting the number that have an ID containing exactly two of any letter and then separately counting those with exactly three of any letter. You can multiply those two counts together to get a rudimentary checksum and compare it to what your device predicts.

For example, if you see the following box IDs:

abcdef contains no letters that appear exactly two or three times.
bababc contains two a and three b, so it counts for both.
abbcde contains two b, but no letter appears exactly three times.
abcccd contains three c, but no letter appears exactly two times.
aabcdd contains two a and two d, but it only counts once.
abcdee contains two e.
ababab contains three a and three b, but it only counts once.
Of these box IDs, four of them contain a letter which appears exactly twice, and three of them contain a letter which appears exactly three times. Multiplying these together produces a checksum of 4 * 3 = 12.

What is the checksum for your list of box IDs?

*/


'use strict';
'use esversion: 6';

var chai = require('chai'), expect = chai.expect;
chai.should();

// Part 1

function containsExactlyTwoOrThreeCharactersOfAnyLetter(boxId){
    var result = {containsTwoCharacterMatch: false, containsThreeCharacterMatch: false};
    let characters = boxId.split('');

    characters.forEach(character => {

        var characterCount = characters.filter(x => x == character).length;

        if(characterCount === 2){
            result.containsTwoCharacterMatch = true;
        }

        if(characterCount === 3){
            result.containsThreeCharacterMatch = true;
        }
    });

    return result;
}

function calculateCheckSum(boxIds){
    var results = [];
    boxIds.forEach(boxId => results.push(containsExactlyTwoOrThreeCharactersOfAnyLetter(boxId)));

    var x = results.filter(x => x.containsTwoCharacterMatch).length;
    var y = results.filter(x => x.containsThreeCharacterMatch).length;
    return x * y;
}

var fs = require('fs');
var input = fs.readFileSync('day02-input.txt').toString().split("\n");
console.log('Checksum: ' + calculateCheckSum(input));


describe('test containsExactlyTwoOrThreeCharactersOfAnyLetter function', function(){

    it('abcdef contains no letters that appear exactly two or three times.', function(){
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abcdef').containsTwoCharacterMatch.should.be.equal(false);
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abcdef').containsThreeCharacterMatch.should.be.equal(false);
    });

    it('bababc contains two a and three b, so it counts for both.', function(){
        containsExactlyTwoOrThreeCharactersOfAnyLetter('bababc').containsTwoCharacterMatch.should.be.equal(true);
        containsExactlyTwoOrThreeCharactersOfAnyLetter('bababc').containsThreeCharacterMatch.should.be.equal(true);
    });

    it('abbcde contains two b, but no letter appears exactly three times.', function(){
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abbcde').containsTwoCharacterMatch.should.be.equal(true);
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abbcde').containsThreeCharacterMatch.should.be.equal(false);
    });

    it('abcccd contains three c, but no letter appears exactly two times.', function(){
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abcccd').containsTwoCharacterMatch.should.be.equal(false);
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abcccd').containsThreeCharacterMatch.should.be.equal(true);
    });

    it('aabcdd contains two a and two d, but it only counts once.', function(){
        containsExactlyTwoOrThreeCharactersOfAnyLetter('aabcdd').containsTwoCharacterMatch.should.be.equal(true);
        containsExactlyTwoOrThreeCharactersOfAnyLetter('aabcdd').containsThreeCharacterMatch.should.be.equal(false);
    });

    it('abcdee contains two e', function(){
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abcdee').containsTwoCharacterMatch.should.be.equal(true);
        containsExactlyTwoOrThreeCharactersOfAnyLetter('abcdee').containsThreeCharacterMatch.should.be.equal(false);
    });

    it('ababab contains three a and three b, but it only counts once.', function(){
        containsExactlyTwoOrThreeCharactersOfAnyLetter('ababab').containsTwoCharacterMatch.should.be.equal(false);
        containsExactlyTwoOrThreeCharactersOfAnyLetter('ababab').containsThreeCharacterMatch.should.be.equal(true);
    });
});

describe('test calculateCheckSum function', function(){

    it('Multiplying these together produces a checksum of 4 * 3 = 12.', function(){

        calculateCheckSum(['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab']).should.be.equal(12);
    });
});


