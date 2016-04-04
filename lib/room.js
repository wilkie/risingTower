/* The Room object holds information about an individual room within the
 * tower.
 */
var initRoom = function(RisingTower) {
  var Room = RisingTower.Room = function(worldX, worldY) {
    // We need to know the size, the type, and store any metadata
    // Rooms need a callback for doing financing per day and per month and per year
    // Both cost and income
    // Rooms have properties that can be changed
    // Room sprites should have some ability to vary

    if (worldX === undefined) {
      worldX = 0;
    }

    if (worldY === undefined) {
      worldY = 0;
    }

    this._sprite = Room._phaser.make.sprite(worldX, worldY, 'rooms/office/idle')
  };

  Room.prototype.sprite = function() {
    return this._sprite;
  };

  Room.prototype.moveTo = function(worldX, worldY) {
    this._sprite.x = worldX;
    this._sprite.y = worldY;
  };

  Room.preload = function(phaser) {
    Room._phaser = phaser;
  };
};
