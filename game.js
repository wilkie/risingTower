/* Creates an instance of the game which initializes the Phaser.io library.
 */
var RisingTower = window.RisingTower = function() {
  var self = this;

  // Initialize variables
  self.loadsPending = 0;
  self.preloads = [];
  self.creates  = [];
  self.updates  = [];
  self.renders  = [];
  self.modules  = [];

  // Initialize all modules
  self.load('Person');
  self.load('Environment');
  self.load('UserInterface');
  self.load('Viewport');
  self.load('World');

  self.onload(function() {
    self.game = new Phaser.Game(800, 600, Phaser.WEBGL, '', {
      preload: function() {
        self.preload();
      },
      create: function() {
        self.create();
      },
      update: function() {
        self.update();
      },
      render: function() {
        self.render();
      }
    })
  });
};

/* This function calls the given callback when the modules are loaded.
 */
RisingTower.prototype.onload = function(callback) {
  this._onload = callback;

  if (this.loadsPending == 0) {
    if (this._onload !== undefined) {
      this._onload();
    }
  }
};

/* This loads a javascript file given by url.
 */
RisingTower.prototype.loadScript = function(url, onload) {
  var self = this;
  this.loadsPending++;

  // Create a <script> tag that points to the file indicated by script.
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');

  // We want to wait until the script is loaded until we call initBlah()
  script.onload = function() {
    onload();
    self.loadsPending--;
    self.onload(self._onload);
  };

  // We insert the <script> to the <head> to actually load the script.
  var head = document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
};

/* This loads a module.
 */
RisingTower.prototype.load = function(name) {
  var self = this;

  // Create the path to the javascript file that implements the object.
  // First we turn the name ("UserInterface") into a filename ("user_interface")
  var filename = name.replace(/.[A-Z]/g, function(m){
    return m[0] + "_" + m[1].toLowerCase();}).toLowerCase();
  var url = 'lib/' + filename + ".js";

  // We will run initBlah and pass the RisingTower object. (where Blah is name)
  var initFunction = 'init' + name;

  // Load the script.
  this.loadScript(url, function() {
    var initModule = window[initFunction];
    if (initModule !== undefined) {
      initModule(window.RisingTower);

      var module = RisingTower[name];

      if (module !== undefined) {
        var moduleInfo = {
          'name': name,
          'object': module,
        };

        // Append preloads, etc
        if (module.preload !== undefined) {
          self.preloads.push({ 'object': module, 'name': name, 'callback': module.preload});
        }
        if (module.create !== undefined) {
          self.creates.push({ 'object': module, 'name': name, 'callback': module.create});
        }
        if (module.update !== undefined) {
          self.updates.push({ 'object': module, 'name': name, 'callback': module.update});
        }
        if (module.render !== undefined) {
          self.renders.push({ 'object': module, 'name': name, 'callback': module.render});
        }

        // Append to our list of modules
        self.modules.push(moduleInfo);
      }
    }
  });
};

/* This loads a mod. Currently unimplemented.
 */
RisingTower.prototype.loadMod = function(name) {
  // Create the path to the javascript file that implements the object.
  var url = 'mods/' + name.toLowerCase() + ".js";

  // We will run initBlah and pass the RisingTower object. (where Blah is name)
  var evalString = 'init' + name + '(window.RisingTower.Mods)';

  // Load the script.
  this.loadScript(url, function() {
    eval(evalString);
  });
};

/* This is called by Phaser to tell us to load resources.
 */
RisingTower.prototype.preload = function() {
  var game = this.game;
  game.load.image('logo', 'phaser.png');

  this.preloads.forEach(function(module) {
    console.log("Preloading " + module.name);
    module.callback.call(module.object, game);
  });
};

/* This is called by Phaser to create the game data and initialize the state
 * of our game.
 */
RisingTower.prototype.create = function() {
  var game = this.game;

  // Initialize game
  RisingTower.world = new RisingTower.World();
  RisingTower.viewport = new RisingTower.Viewport(
    0, 0, 800, 600, RisingTower.world);
  RisingTower.viewport.bottomAt(64);
  RisingTower.UserInterface.addViewport(RisingTower.viewport);

  //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
  //logo.anchor.setTo(0.5, 0.5);

  this.creates.forEach(function(module) {
    console.log("Creating " + module.name);
    module.callback.call(module.object, game);
  });
};

/* This is called by Phaser whenever the game should be updated.
 */
RisingTower.prototype.update = function() {
  var game = this.game;

  this.updates.forEach(function(module) {
    module.callback.call(module.object, game);
  });
};

/* This is called by Phaser every frame to draw the graphics of the
 * game.
 */
RisingTower.prototype.render = function() {
  var game = this.game;

  this.renders.forEach(function(module) {
    module.callback.call(module.object, game);
  });
};
