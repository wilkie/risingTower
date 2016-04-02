/* Environment class handles the background and weather.
 */
var initEnvironment = function(RisingTower) {
  var Environment = RisingTower.Environment = function() {
    RisingTower.hook({
      preload: Environment.preload,
      dependencies: "Person"
    });
  };

  Environment.metadata = {
    dependencies: "Person"
  };

  Environment.preload = function(phaser) {
    // Load the background graphics.
  };

  Environment.create = function(phaser) {
    // Draw background
    // Set background color
    phaser.stage.backgroundColor = 0xB0E6E6;
  };
};
