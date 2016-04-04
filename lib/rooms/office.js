/* This module represents an Office room.
 */
var initRoomsOffice = function(Rooms) {
  var Office = Rooms.Office = {
    // The name of the room.
    name: {
      en: "Office"
    },

    // The subtype of room
    group: 'offices',

    // The cost of the room
    cost: 80000,

    // Returns true when we can build this room at the given coordinates.
    isBuildableAt: function(worldX, floorY) {
      return true;
    },

    // Called by the engine as the game is loading to load in any assets.
    preload: function(phaser) {
    },
  };
};
