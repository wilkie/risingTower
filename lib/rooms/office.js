/* This module represents an Office room.
 */
var initOffice = function(Rooms) {
  var Office = Rooms.Office = {
    group: 'offices',
     cost: 80000,

    isBuildableAt: function(worldX, floorY) {
      return true;
    },

    preload: function() {
    },
  };
};
