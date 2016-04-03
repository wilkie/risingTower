/* Environment class handles the background and weather.
 */
var initEnvironment = function(RisingTower) {
  var Environment = RisingTower.Environment = function(viewport) {
    var x = viewport.x();
    var y = viewport.y();
    var width = viewport.width();
    var height = viewport.height();

    this._viewport = viewport;

    this._environment = "rain";

    // move to viewport
    var maskGraphics = Environment._phaser.add.graphics(0,0);
    maskGraphics.beginFill(0xffffff, 0.0);
    maskGraphics.drawRect(x, y, width, height);
    maskGraphics.endFill();

    var envInfo = Environment._environments[this._environment];
    this._skySprite     = Environment._phaser.add.tileSprite(x, y, width, height, envInfo.sky);
    this._groundSprite  = Environment._phaser.add.tileSprite(x, y, width, height, envInfo.ground);
    this._horizonSprite = Environment._phaser.add.tileSprite(x, y, width, 32, envInfo.horizon);

    if (envInfo.weather) {
      this._weatherSprite = Environment._phaser.add.tileSprite(x, y, width, height, envInfo.weather.texture);
      this._weatherSprite.mask = maskGraphics;
    }

    this._skySprite.mask     = maskGraphics;
    this._groundSprite.mask  = maskGraphics;
    this._horizonSprite.mask = maskGraphics;

    this.moveTo(viewport.worldX(), viewport.worldY());

    Environment._instances.push(this);
  };

  /* Instance Methods */

  Environment.prototype.moveTo = function(worldX, worldY) {
    this._worldX = worldX;
    this._worldY = worldY;

    this._skySprite.tilePosition.y = -this._worldY;
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

    if (this.worldY >= 0) {
      this._skySprite.visible = false;
    }
    else {
      this._skySprite.visible = true;
    }

    if (this._weatherSprite) {
      this._weatherSprite.visible = this._skySprite.visible;
      this._weatherSprite.y       = this._skySprite.y;
      this._weatherSprite.height  = this._skySprite.height;
    }

    if (this.worldY + this._viewport.height() <= 0) {
      this._groundSprite.visible = false;
    }
    else {
      this._groundSprite.visible = true;
    }

    this._horizonSprite.y = -this._worldY - 16;
  };

  Environment.update = function() {
    Environment._instances.forEach(function(environment) {
      var info = Environment._environments[environment._environment];
      if (environment._weatherSprite && info.weather) {
        environment._weatherSprite.alpha           = info.weather.alpha;
        environment._weatherSprite.tilePosition.x += info.weather.deltaX * info.weather.speed;
        environment._weatherSprite.tilePosition.y += info.weather.deltaY * info.weather.speed;
      }
    });
  };

  Environment.prototype.render = function() {
  };

  /* Object methods */

  Environment._instances = [];

  Environment._environments = {};

  Environment.addEnvironment = function(name, environment) {
    Environment._environments[name] = environment;
  };

  Environment.preload = function(phaser) {
    Environment._phaser = phaser;

    // Load the background graphics.
    phaser.load.image('environment/sky/day',       'resources/environment/sky/day.png');
    phaser.load.image('environment/sky/rain',      'resources/environment/sky/rain.png');
    phaser.load.image('environment/ground/normal', 'resources/environment/ground/normal.png');
    phaser.load.image('environment/horizon/day',   'resources/environment/horizon/grass.png');
    phaser.load.image('environment/weather/day',   'resources/environment/weather/rain.png');

    Environment.addEnvironment('day', {
          'sky': 'environment/sky/day',
       'ground': 'environment/ground/normal',
      'horizon': 'environment/horizon/day'
    });

    Environment.addEnvironment('rain', {
          'sky': 'environment/sky/rain',
       'ground': 'environment/ground/normal',
      'horizon': 'environment/horizon/day',
      'weather': {
        'texture': 'environment/weather/day',
        'alpha':  0.5,
        'speed':  2.0,
        'deltaX': 1.0,
        'deltaY': 5.0
      }
    });
  };
};

// an environment has a bg, a transition, a delay of transition, and a collection of animations
// environments are above ground
// ground
