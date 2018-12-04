/*
https://adventofcode.com/2018/day/3

The Elves managed to locate the chimney-squeeze prototype fabric for Santa's suit (thanks to someone who helpfully wrote its box IDs on the wall of the warehouse in the middle of the night). Unfortunately, anomalies are still affecting them - nobody can even agree on how to cut the fabric.

The whole piece of fabric they're working on is a very large square - at least 1000 inches on each side.

Each Elf has made a claim about which area of fabric would be ideal for Santa's suit. All claims have an ID and consist of a single rectangle with edges parallel to the edges of the fabric. Each claim's rectangle is defined as follows:

The number of inches between the left edge of the fabric and the left edge of the rectangle.
The number of inches between the top edge of the fabric and the top edge of the rectangle.
The width of the rectangle in inches.
The height of the rectangle in inches.
A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3 inches from the left edge, 2 inches from the top edge, 5 inches wide, and 4 inches tall. Visually, it claims the square inches of fabric represented by # (and ignores the square inches of fabric represented by .) in the diagram below:

...........
...........
...#####...
...#####...
...#####...
...#####...
...........
...........
...........

The problem is that many of the claims overlap, causing two or more claims to cover part of the same areas. For example, consider the following claims:

#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
Visually, these claim the following areas:

........
...2222.
...2222.
.11XX22.
.11XX22.
.111133.
.111133.
........

The four square inches marked with X are claimed by both 1 and 2. (Claim 3, while adjacent to the others, does not overlap either of them.)

---Part one---
If the Elves all proceed with their own plans, none of them will have enough fabric. How many square inches of fabric are within two or more claims?


--- Part Two ---
Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim. If you can somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!

For example, in the claims above, only claim 3 is intact after all claims are made.

What is the ID of the only claim that doesn't overlap?


*/

'use strict';
'use esversion: 6';

var chai = require('chai'), expect = chai.expect;
chai.should();

// Part 1

function calculateOverlappingSquareInches(claims){

    var fabric = [];

    for(var i=0; i<1000; i++) {
        fabric[i] = new Array(1000);
    }

    claims.forEach(claim => {

        claim.overlapping = false;

        for(var y=claim.top; y < claim.top + claim.height; y++){
            for(var x=claim.left; x < claim.left + claim.width; x++){
                
                var currentSquareId = fabric[x][y];

                if(currentSquareId && currentSquareId != claim.id){

                    fabric[x][y] = 'X';
                    
                    if(currentSquareId !== 'X'){
                        claims.find(x => x.id === currentSquareId).overlapping = true;
                    }

                    claim.overlapping = true;
                }
                else{
                    fabric[x][y] = claim.id;
                }
            }
        }
    });

    var overlappingSquares = 0;

    fabric.forEach(row => {
        row.forEach(column => {
            if(column === 'X'){
                overlappingSquares++;
            }
        });
    });

    return overlappingSquares;
}

function buildClaims(input){

    var claims = [];
    input.split('\n').forEach(inputLine => {

        try{
            //Replace all non numerical characters with whitespace and then 
            //match everything that is NOT whitespace.
            var inputLine = inputLine.replace(/\D/g,' ').match(/\S+/g);

            claims.push({
                id: parseInt(inputLine[0]),
                left: parseInt(inputLine[1]), 
                top: parseInt(inputLine[2]),
                width: parseInt(inputLine[3]), 
                height: parseInt(inputLine[4])});
        }
        catch(exception){
            throw "Input not in expected format";
        }
    });

    return claims;
}

var fs = require('fs');
var claims = buildClaims(fs.readFileSync('day03-input.txt').toString());
var overlappingSquares = calculateOverlappingSquareInches(claims);

console.log('Overlaping square inches: ' + overlappingSquares);

console.log('The following claim dose not overlap: ' + claims.find(x => !x.overlapping).id);


describe('test claim builder', function(){

    it('single claim returns one object', function(){
        buildClaims("#1 @ 1,3: 4x4").length.should.be.equal(1);
    });

    it('object builder can handle multi-digit integers', function(){
        buildClaims("#111 @ 11,33: 44x44")[0].id.should.be.equal(111);
    });

    it('object builder mapps input as expected', function(){
        var actual = buildClaims("#1 @ 2,3: 4x5");
        actual[0].id.should.be.equal(1);
        actual[0].left.should.be.equal(2);
        actual[0].top.should.be.equal(3);
        actual[0].width.should.be.equal(4);
        actual[0].height.should.be.equal(5);
    });

    it('two claims returns two objects', function(){
        buildClaims("#1 @ 1,3: 4x4\n#2 @ 1,3: 4x4").length.should.be.equal(2);
    });

});

describe('test overlapping square inches calculator', function(){

    it('single claim should have no overlapping square inches', function(){

        var claims = [];
        claims.push({id: 1, left: 1, top: 1, width:1, height:1});

        calculateOverlappingSquareInches(claims).should.be.equal(0);
    });

    it('two claims of one square inch on the same square should have 1 overlapping square inch', function(){

        var claims = [];
        claims.push({id: 1, left: 1, top: 1, width:1, height:1});
        claims.push({id: 2, left: 1, top: 1, width:1, height:1});

        calculateOverlappingSquareInches(claims).should.be.equal(1);
    });

    it('claims that are next to overlapping square inches do not count as overlapping', function(){

        var claims = [];
        claims.push({id: 1, left: 1, top: 3, width:4, height:4});
        claims.push({id: 2, left: 3, top: 1, width:4, height:4});
        claims.push({id: 2, left: 5, top: 5, width:2, height:2});

        calculateOverlappingSquareInches(claims).should.be.equal(4);
    });

    it('claim is not marked as overlapping if none of its square inches overlap', function(){

        var claims = [];
        claims.push({id: 1, left: 1, top: 1, width:1, height:1});

        calculateOverlappingSquareInches(claims);

        claims[0].overlapping.should.be.equal(false);
    });

    it('both claims should be marked as overlapping if one of its squares overlaps', function(){

        var claims = [];
        claims.push({id: 1, left: 1, top: 1, width:1, height:1});
        claims.push({id: 2, left: 1, top: 1, width:1, height:1});

        calculateOverlappingSquareInches(claims);

        claims[0].overlapping.should.be.equal(true);
        claims[1].overlapping.should.be.equal(true);
    });
});

