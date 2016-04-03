/* Environment class handles the background and weather.
 */
var initEnvironment = function(RisingTower) {
  var Environment = RisingTower.Environment = function(viewport) {
    var x = viewport.x();
    var y = viewport.y();
    var width = viewport.width();
    var height = viewport.height();

    this._viewport = viewport;

    this._environment  = "day";
    this._skySprite    = Environment._phaser.add.tileSprite(x, y, width, height, Environment._environments['day'].sky);
    this._groundSprite = Environment._phaser.add.tileSprite(x, y, width, height, Environment._environments['day'].ground);
    var maskGraphics = Environment._phaser.add.graphics(0,0);
    maskGraphics.beginFill(0xffffff, 0.0);
    maskGraphics.drawRect(x, y, width, height);
    maskGraphics.endFill();

    this._skySprite.mask    = maskGraphics;
    this._groundSprite.mask = maskGraphics;

    // this._weatherSprite = ... (rain, snow, etc)

    this.moveTo(viewport.worldX(), viewport.worldY());
  };

  /* Instance Methods */

  Environment.prototype.moveTo = function(worldX, worldY) {
    this._worldX = worldX;
    this._worldY = worldY;

    this._skySprite.tilePosition.y = 3000 + this._worldY;
    this._skySprite.height = -this._worldY;
    if (this._skySprite.height > this._viewport.height()) {
      this._skySprite.height = this._viewport.height();
    }

    this._groundSprite.tilePosition.y = 0;
    this._groundSprite.height = this._viewport.height() + this._worldY;
    this._groundSprite.y      = -this._worldY;
    if (this._groundSprite.height > this._viewport.height()) {
      this._groundSprite.tilePosition.y = -this._worldY;
      this._groundSprite.height = this._viewport.height();
      this._groundSprite.y = this._viewport.y();
    }

    console.log("worldY: " + worldY + ", tp.y: " + this._groundSprite.tilePosition.y + ", height: " + this._groundSprite.height);

    if (this.worldY >= 0) {
      this._skySprite.visible = false;
    }
    else {
      this._skySprite.visible = true;
    }
  };

  Environment.prototype.render = function() {
  };

  /* Object methods */

  Environment._environments = {};

  Environment.addEnvironment = function(name, environment) {
    Environment._environments[name] = environment;
  };

  Environment.preload = function(phaser) {
    Environment._phaser = phaser;

    // Load the background graphics.
    phaser.load.image('environment/sky/day',       'resources/environment/bgDay.png');
    phaser.load.image('environment/ground/ground', 'resources/environment/ground.png');

    Environment.addEnvironment('day', {
         'sky': 'environment/sky/day',
      'ground': 'environment/ground/ground'
    });
  };
};

// an environment has a bg, a transition, a delay of transition, and a collection of animations
// environments are above ground
// ground
