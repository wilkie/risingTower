/* The Room object holds information about an individual room within the
 * tower.
 */
var initRoom = function(RisingTower) {
  var Room = RisingTower.Room = function(metadata, index, worldX, floor) {
    // We need to know the size, the type, and store any metadata
    // Rooms need a callback for doing financing per day and per month and per year
    // Both cost and income
    // Rooms have properties that can be changed
    // Room sprites should have some ability to vary

    this._metadata = metadata;

    if (worldX === undefined) {
      worldX = 0;
    }

    var worldY = 0;
    if (floor !== undefined) {
      worldY = floor.y();
    }

    this._index = index;
    this._floor = floor;
  };

  Room.prototype.index = function() {
    return this._index;
  };

  /* Returns the Floor to which this Room belongs.
   */
  Room.prototype.floor = function() {
    return this._floor;
  };

  /* Returns the World to which this Room belongs.
   */
  Room.prototype.world = function() {
    if (this._floor) {
      return this._floor.world();
    }
  };
};
