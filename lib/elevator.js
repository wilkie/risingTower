/* The Elevator object represents an elevator object.
 */
var initElevator = function(RisingTower) {
  var Elevator = RisingTower.Elevator = function() {
  };

  Elevator.preload = function(phaser) {
    // Load elevator graphics
  };

  /* Adds the given elevator to the list of possible elevators one can add
   * to the tower.
   */
  Elevator.addElevator = function() {
    // Stats like max floors, which floors it can go to, what types
    // of people can use them etc.
    var info = {
      basementFactor: 1,
         floorFactor: 1,
           maxFloors: 30,
    };

    var blahinfo = {
      basementFactor: 1,
         floorFactor: 15, // 1, 15, 30, 45, 60, 75, etc
           maxFloors: 100,
    };
  };
};
