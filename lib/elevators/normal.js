/* This module represents a normal elevator.
 */
var initElevatorsNormal = function(Elevators) {
  var Normal = Elevators.Normal = {
    // The name of the elevator.
    name: {
      en: "Normal"
    },

    // The initial cost of the elevator.
    cost: 200000,

    // The cost for building another floor.
    floorCost: 0,

    // The cost to add another car to the shaft.
    carCost: 200000,

    // The maximum number of people who can fit.
    occupancy: 20,

    // The floor multiple that the elevator can visit.
    floorFactor: 1,

    // The basement floor multiple that the elevator can visit.
    basementFactor: 1,

    // The maximum height of the elevator.
    maxFloors: 30,

    // Returns true when it is buildable at the given coordinates.
    isBuildableAt: function(worldX, floorY) {
      return true;
    },

    // Called by the engine as the game is loading to load in any assets.
    preload: function(phaser) {
      phaser.load.image('elevators/normal/car',   'resources/elevators/normal/car.png');
      phaser.load.image('elevators/normal/shaft', 'resources/elevators/normal/shaft.png');
      phaser.load.image('elevators/normal/upper', 'resources/elevators/normal/upper.png');
      phaser.load.image('elevators/normal/lower', 'resources/elevators/normal/lower.png');
    },
  };
};
