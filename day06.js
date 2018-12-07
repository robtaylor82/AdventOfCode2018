/*
    --- Day 6: Chronal Coordinates ---
The device on your wrist beeps several times, and once again you feel like you're falling.

"Situation critical," the device announces. "Destination indeterminate. Chronal interference detected. Please specify new target coordinates."

The device then produces a list of coordinates (your puzzle input). Are they places it thinks are safe or dangerous? It recommends you check manual page 729. The Elves did not give you a manual.

If they're dangerous, maybe you can minimize the danger by finding the coordinate that gives the largest distance from the other points.

Using only the Manhattan distance, determine the area around each coordinate by counting the number of integer X,Y locations that are closest to that coordinate (and aren't tied in distance to any other coordinate).

Your goal is to find the size of the largest area that isn't infinite. For example, consider the following list of coordinates:

1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
If we name these coordinates A through F, we can draw them on a grid, putting 0,0 at the top left:

..........
.A........
..........
........C.
...D......
.....E....
.B........
..........
..........
........F.
This view is partial - the actual grid extends infinitely in all directions. Using the Manhattan distance, each location's closest coordinate can be determined, shown here in lowercase:

aaaaa.cccc
aAaaa.cccc
aaaddecccc
aadddeccCc
..dDdeeccc
bb.deEeecc
bBb.eeee..
bbb.eeefff
bbb.eeffff
bbb.ffffFf
Locations shown as . are equally far from two or more coordinates, and so they don't count as being closest to any.

In this example, the areas of coordinates A, B, C, and F are infinite - while not shown here, their areas extend forever outside the visible grid. However, the areas of coordinates D and E are finite: D is closest to 9 locations, and E is closest to 17 (both including the coordinate's location itself). Therefore, in this example, the size of the largest area is 17.

What is the size of the largest area that isn't infinite?
*/

'use strict';

var chai = require('chai'), expect = chai.expect;
chai.should();

Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };

// Part 1

function loadInputAndAssignIds(input){
    var inputLine = input.split("\n");
    var results = [];

    inputLine.forEach(line =>{
        results.push({x: parseInt(line.split(',')[0]), y: parseInt(line.split(',')[1]), id: results.length});
    });

    return results;
}

function buildGrid(coordinates){
    var grid = [];
    var maxX = Math.max.apply(Math,coordinates.map(function(o){return o.x;}));
    var maxY = Math.max.apply(Math,coordinates.map(function(o){return o.y;}));

    for(var y=0; y<=maxY; y++) {
        grid[y] = new Array(maxX + 1);
    }

    return grid;
}

function calculateManhattanDistance(x, y, coordinate){
    return Math.abs(x-coordinate.x) + Math.abs(y-coordinate.y);
}

function populateEachGridSquareWithClosestCoordinates(grid, coordinates){
    for(var y=0; y < grid.length; y++){
        for(var x=0; x < grid[y].length; x++){

            var allDistances = [];

            for(var i=0; i < coordinates.length; i++){
                var distance = calculateManhattanDistance(x,y,coordinates[i]);

                if(allDistances.length === 0 || distance < allDistances.min()){
                    grid[y][x] = coordinates[i].id;
                }

                allDistances.push(distance);
            }
            
            allDistances = allDistances.sort(function (a, b) { return a - b;});

            if(allDistances[0] === allDistances[1]){
                grid[y][x] = '.';
            }
        }
    }

    return grid;
}

function clearGridOfAllInfinateAreas(grid){
    var idsTouchingGridEdge = [];

    //Get top row and bottom row
    grid[0].forEach(x=> idsTouchingGridEdge.push(x));
    grid[grid.length-1].forEach(x=> idsTouchingGridEdge.push(x));

    //Get left column and right column
    grid.forEach(y=> idsTouchingGridEdge.push(y[0]));
    grid.forEach(y=> idsTouchingGridEdge.push(y[y.length-1]));

    var infinateCoordinates = [...new Set(idsTouchingGridEdge)]; 

    for(var y=0; y < grid.length; y++){
        for(var x=0; x < grid[y].length; x++){
            if(infinateCoordinates.includes(grid[y][x])){
                grid[y][x] = '.';
            }
        }
    }
    
    return grid;
}

function findLargestArea(grid){
    var results = {};

    for(var y=0; y < grid.length; y++){
        for(var x=0; x < grid[y].length; x++){

            var currentCell = grid[y][x];

            if(currentCell === '.'){
                continue;
            }

            if(!results[currentCell]){
                results[currentCell] = 1;
            }
            else{
                results[currentCell] = results[currentCell] + 1;
            }
        }
    }

    var largestArea = -1;

    Object.keys(results).forEach(function(key) {
        if(results[key] > largestArea){
            largestArea = results[key];
        }
    });

    return largestArea;
}


var input = require('fs').readFileSync('day06-input.txt').toString();
var coordinates = loadInputAndAssignIds(input);
var grid = buildGrid(coordinates);
grid = populateEachGridSquareWithClosestCoordinates(grid, coordinates);
grid = clearGridOfAllInfinateAreas(grid);
var result = findLargestArea(grid);

console.log('Largest non-infinate area is ' + result);

describe('find largest area', function(){
    it('the largest number of grid squares with the same id should be return', function(){
        var e = '.';
        var grid = [[e,e,e],
                    [e,1,1],
                    [2,2,2]];
        findLargestArea(grid).should.be.equal(3);
    });
});

describe('remove any coordinates which have an infinate area', function(){
    it('all ids touching the edge of the grid are removed', function(){
        var grid = [[1,2,3],
                    [4,5,6],
                    [7,8,9]]
        var results = clearGridOfAllInfinateAreas(grid);
        results[0][0].should.be.equal('.');
        results[0][1].should.be.equal('.');
        results[0][2].should.be.equal('.');
        results[1][0].should.be.equal('.');
        results[1][1].should.be.equal(5);
        results[1][2].should.be.equal('.');
        results[2][0].should.be.equal('.');
        results[2][1].should.be.equal('.');
        results[2][2].should.be.equal('.');
    });
});

describe('populate each grid square with the closest coordinate', function(){
    it('ensure squares with two sets of coordinates at equal distance are populated with a .', function(){
       var coordinates = loadInputAndAssignIds('1, 1\n1, 6\n8, 3\n3, 4\n5, 5\n8, 9');
       var grid = buildGrid(coordinates);
       var results = populateEachGridSquareWithClosestCoordinates(grid, coordinates);
       results[4][0].should.be.equal('.');
    });
    it('ensure squares with only one closest coordinate are set to that id', function(){
        var coordinates = loadInputAndAssignIds('1, 1\n1, 6\n8, 3\n3, 4\n5, 5\n8, 9');
        var grid = buildGrid(coordinates);
        var results = populateEachGridSquareWithClosestCoordinates(grid, coordinates);
        results[0][0].should.be.equal(0);
        results[1][1].should.be.equal(0);
        results[5][0].should.be.equal(1);
        results[5][1].should.be.equal(1);
        results[9][0].should.be.equal(1);
        results[9][4].should.be.equal(5);
    });
});

describe('load input and assign ids', function(){
    it('input is parsed correctly', function(){
        var results = loadInputAndAssignIds('158, 163');
        results.length.should.be.equal(1);
        results[0].x.should.be.equal(158);
        results[0].y.should.be.equal(163);
        results[0].id.should.be.equal(0);
    });
    it('linebreaks are parsed correctly', function(){
        var result = loadInputAndAssignIds('158, 163\n1, 1\n3,3');
        result.length.should.be.equal(3);
    });
});

describe('build Grid', function(){
    it('grid is of expected size', function(){
        var grid = buildGrid([{x: 10, y:20}]);
        grid.length.should.be.equal(21);
        grid[0].length.should.be.equal(11);
    });
});

describe('calculate manhattan distance', function(){
    it('next square on same row', function(){
        calculateManhattanDistance(0,0, {x: 1, y: 0}).should.be.equal(1);
    });
    it('next square on same column', function(){
        calculateManhattanDistance(0,0, {x: 0, y: 1}).should.be.equal(1);
    });
    it('next square diagnoally down', function(){
        calculateManhattanDistance(0,0, {x: 1, y: 1}).should.be.equal(2);
    });
    it('six squares away', function(){
        calculateManhattanDistance(0,5, {x: 1, y: 1}).should.be.equal(5);
    });
});